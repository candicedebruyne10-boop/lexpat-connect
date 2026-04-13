/**
 * lib/referral.js
 * Logique métier centrale du système de parrainage LEXPAT Connect.
 * Utilisé côté serveur (API routes) uniquement.
 */

// Caractères sans ambiguïté visuelle : pas de 0/O, 1/I
const REFERRAL_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REFERRAL_PREFIX = 'LP-';
const REFERRAL_LENGTH = 6;

/**
 * Génère un code de parrainage unique de type LP-XXXXXX.
 * Collision-résistant : ~32^6 = ~1 milliard de combinaisons possibles.
 */
export function generateReferralCode() {
  let code = '';
  for (let i = 0; i < REFERRAL_LENGTH; i++) {
    code += REFERRAL_CHARS[Math.floor(Math.random() * REFERRAL_CHARS.length)];
  }
  return `${REFERRAL_PREFIX}${code}`;
}

/**
 * Génère un code garanti unique en vérifiant en base.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns {Promise<string>}
 */
export async function generateUniqueReferralCode(supabase) {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateReferralCode();
    const { data } = await supabase
      .from('worker_profiles')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();
    if (!data) return code;
    attempts++;
  }
  throw new Error('Impossible de générer un code unique après 10 tentatives.');
}

/**
 * Résout un code de parrainage vers l'user_id du parrain.
 * Retourne null si code invalide ou parrain introuvable.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} code
 * @returns {Promise<{ referrer_user_id: string, referrer_worker_profile_id: string } | null>}
 */
export async function resolveReferralCode(supabase, code) {
  if (!code || typeof code !== 'string') return null;

  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith('LP-') || normalized.length !== 9) return null;

  const { data } = await supabase
    .from('worker_profiles')
    .select('id, user_id')
    .eq('referral_code', normalized)
    .maybeSingle();

  if (!data) return null;

  return {
    referrer_user_id: data.user_id,
    referrer_worker_profile_id: data.id
  };
}

/**
 * Résout un nom saisi (prénom + nom) vers l'user_id du parrain.
 * Recherche exacte insensible à la casse.
 * Retourne null si aucun résultat ou résultat ambigu (>1 match).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} name
 * @returns {Promise<{ referrer_user_id: string, referrer_worker_profile_id: string } | null>}
 */
export async function resolveReferralByName(supabase, name) {
  if (!name || typeof name !== 'string' || name.trim().length < 3) return null;

  const normalized = name.trim();

  // Recherche insensible à la casse via ilike (PostgreSQL)
  const { data } = await supabase
    .from('worker_profiles')
    .select('id, user_id, full_name')
    .ilike('full_name', normalized)
    .limit(2);

  // Ambigu ou introuvable
  if (!data || data.length === 0 || data.length > 1) return null;

  return {
    referrer_user_id: data[0].user_id,
    referrer_worker_profile_id: data[0].id
  };
}

/**
 * Crée un enregistrement de parrainage dans la table referrals.
 * Idempotent si le filleul a déjà un referral (unique constraint).
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {object} params
 * @param {string} params.referrer_user_id
 * @param {string} [params.referrer_worker_profile_id]
 * @param {string} [params.referee_user_id]
 * @param {string} params.referral_code
 * @param {string} params.attribution_source - 'link' | 'manual_code' | 'manual_name' | 'unknown'
 * @param {string} [params.referrer_name_input]
 * @returns {Promise<{ id: string } | null>}
 */
export async function createReferral(supabase, params) {
  const {
    referrer_user_id,
    referrer_worker_profile_id,
    referee_user_id,
    referral_code,
    attribution_source,
    referrer_name_input
  } = params;

  // Guard : pas d'auto-parrainage
  if (referee_user_id && referrer_user_id === referee_user_id) {
    await logReferralEvent(supabase, {
      event_type: 'referral_invalid',
      referral_code,
      attribution_source,
      referrer_user_id,
      referee_user_id,
      metadata: { reason: 'self_referral' }
    });
    return null;
  }

  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_user_id,
      referrer_worker_profile_id: referrer_worker_profile_id || null,
      referee_user_id: referee_user_id || null,
      referral_code,
      attribution_source,
      referrer_name_input: referrer_name_input || null,
      status: referee_user_id ? 'registered' : 'pending',
      attributed_at: referee_user_id ? new Date().toISOString() : null,
      registered_at: referee_user_id ? new Date().toISOString() : null
    })
    .select('id')
    .single();

  if (error) {
    // Duplicate key = filleul déjà parrainé → log et retour gracieux
    if (error.code === '23505') {
      await logReferralEvent(supabase, {
        event_type: 'referral_duplicate',
        referral_code,
        attribution_source,
        referrer_user_id,
        referee_user_id,
        metadata: { error: error.message }
      });
      return null;
    }
    console.error('[referral] createReferral error:', error.message);
    return null;
  }

  return data;
}

/**
 * Met à jour le statut d'un referral existant.
 * Utilisé lors des transitions profile_completed → profile_visible → validated.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} referee_user_id
 * @param {'profile_completed' | 'profile_visible'} newStatus
 */
export async function updateReferralStatus(supabase, referee_user_id, newStatus) {
  if (!referee_user_id) return;

  const allowedTransitions = ['profile_completed', 'profile_visible'];
  if (!allowedTransitions.includes(newStatus)) return;

  const timestampField = newStatus === 'profile_completed'
    ? 'profile_completed_at'
    : 'profile_visible_at';

  // Ne mettre à jour que si le statut actuel est inférieur
  const statusOrder = {
    pending: 0,
    pending_review: 0,
    registered: 1,
    profile_completed: 2,
    profile_visible: 3,
    validated: 4,
    invalid: -1
  };

  const { data: existing } = await supabase
    .from('referrals')
    .select('id, status')
    .eq('referee_user_id', referee_user_id)
    .maybeSingle();

  if (!existing) return;
  if ((statusOrder[existing.status] ?? 0) >= (statusOrder[newStatus] ?? 0)) return;

  await supabase
    .from('referrals')
    .update({
      status: newStatus,
      [timestampField]: new Date().toISOString()
    })
    .eq('id', existing.id);
}

/**
 * Logge un événement de parrainage dans referral_events.
 * Non-bloquant, ne lève pas d'erreur.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {object} event
 */
export async function logReferralEvent(supabase, event) {
  try {
    await supabase.from('referral_events').insert({
      referral_id: event.referral_id || null,
      event_type: event.event_type,
      referral_code: event.referral_code || null,
      attribution_source: event.attribution_source || null,
      raw_input: event.raw_input || null,
      referrer_user_id: event.referrer_user_id || null,
      referee_user_id: event.referee_user_id || null,
      metadata: event.metadata || null
    });
  } catch (err) {
    console.error('[referral] logReferralEvent error:', err.message);
  }
}

/**
 * Détermine la source d'attribution à partir des données reçues dans le body.
 * Priorité : cookie/lien (ref_code) > saisie code > saisie nom
 *
 * @param {object} body - Corps de la requête bootstrap
 * @returns {{ code: string | null, source: string, rawInput: string | null }}
 */
export function extractReferralInput(body) {
  const refCode = body?.referral_code || body?.ref_code || null;
  const refInput = body?.referral_input || null; // Champ libre (code ou nom)

  // Cas 1 : code de parrainage transmis depuis cookie/URL (format LP-XXXXXX)
  if (refCode && /^LP-[A-Z0-9]{6}$/.test(refCode.trim().toUpperCase())) {
    return {
      code: refCode.trim().toUpperCase(),
      source: 'link',
      rawInput: refCode
    };
  }

  // Cas 2 : saisie manuelle ressemblant à un code LP-
  if (refInput && /^LP-[A-Z0-9]{6}$/i.test(refInput.trim())) {
    return {
      code: refInput.trim().toUpperCase(),
      source: 'manual_code',
      rawInput: refInput
    };
  }

  // Cas 3 : saisie manuelle (nom)
  if (refInput && refInput.trim().length >= 3) {
    return {
      code: null,
      source: 'manual_name',
      rawInput: refInput.trim()
    };
  }

  return { code: null, source: 'unknown', rawInput: null };
}

/**
 * Construit l'URL de parrainage pour un code donné.
 * @param {string} code
 * @param {string} [locale]
 * @returns {string}
 */
export function buildReferralUrl(code, locale = 'fr') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://lexpat-connect.be';
  const path = locale === 'en' ? '/en/inscription' : '/inscription';
  return `${base}${path}?ref=${encodeURIComponent(code)}`;
}

/**
 * Texte de partage prêt à copier (WhatsApp / SMS).
 * @param {string} referralUrl
 * @param {string} [locale]
 * @returns {string}
 */
export function buildShareMessage(referralUrl, locale = 'fr') {
  if (locale === 'en') {
    return `👋 I'm on LEXPAT Connect, a Belgian platform to find a job in Belgium if you're a qualified international worker.\n\nIt's really worth creating a profile — employers are looking for profiles like yours.\n\nSign up directly via my link: ${referralUrl}`;
  }
  return `👋 Je suis sur LEXPAT Connect, une plateforme belge pour trouver un emploi en Belgique si tu es travailleur international qualifié.\n\nÇa vaut vraiment le coup de créer un profil — les employeurs cherchent des profils comme le tien.\n\nInscris-toi directement via mon lien : ${referralUrl}`;
}
