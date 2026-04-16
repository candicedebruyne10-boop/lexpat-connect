/**
 * GET  /api/admin/campaigns?page=1&limit=20   — historique des campagnes
 * POST /api/admin/campaigns                   — envoyer une campagne
 *
 * Body POST :
 * {
 *   segment:   string,   // ex: "workers_hidden"
 *   template:  string,   // ex: "visibility_reminder"
 *   subject:   string,
 *   name:      string,   // nom libre pour identifier la campagne
 *   locale:    "fr"|"en"|"auto",  // "auto" = locale du destinataire
 *   dry_run:   boolean,
 *   contact_ids?: string[]  // si présent : envoie seulement à ces IDs
 * }
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";
import { getUnsubscribeUrl } from "../../../../lib/email-unsubscribe";
import { buildReferralUrl, generateUniqueReferralCode } from "../../../../lib/referral";
import {
  workerVisibilityPriorityEmailHtml,
  workerProfileIncompleteEmailHtml,
  workerCompleteProfileEmailHtml,
  employerPublishOfferEmailHtml,
  inactivityReminderEmailHtml,
  genericCampaignEmailHtml,
  customCampaignEmailHtml,
} from "../../../../lib/email-templates";

// ─── Accès admin ─────────────────────────────────────────────────────────────

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map(e => e.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

// ─── Templates disponibles ────────────────────────────────────────────────────

export const TEMPLATES = [
  {
    id: "visibility_initial",
    label: "Rendre son profil visible (1ère relance)",
    description: "Invite les travailleurs à rendre leur profil visible avant lundi.",
    segments: ["workers_hidden", "workers_all"],
    locale: "auto",
    subject_fr: "Rendez votre profil visible avant lundi",
    subject_en: "Make your profile visible before Monday",
  },
  {
    id: "visibility_reminder",
    label: "Rendre son profil visible (rappel)",
    description: "Rappel : profil toujours masqué, dernière chance.",
    segments: ["workers_hidden"],
    locale: "auto",
    subject_fr: "Rappel : rendez votre profil visible avant lundi",
    subject_en: "Reminder: make your profile visible before Monday",
  },
  {
    id: "complete_profile",
    label: "Compléter son profil",
    description: "Pour les profils incomplets : les encourage à renseigner les infos manquantes.",
    segments: ["workers_incomplete", "workers_hidden"],
    locale: "auto",
    subject_fr: "Complétez votre profil LEXPAT Connect",
    subject_en: "Complete your LEXPAT Connect profile",
  },
  {
    id: "employer_publish_offer",
    label: "Employeur — Publier une offre",
    description: "Invite les employeurs sans offre publiée à créer leur première offre.",
    segments: ["employers_without_offers", "employers_all"],
    locale: "fr",
    subject_fr: "Publiez votre première offre sur LEXPAT Connect",
    subject_en: "Publish your first opening on LEXPAT Connect",
  },
  {
    id: "inactivity_reminder",
    label: "Rappel d'inactivité",
    description: "Rappel pour les membres inactifs depuis 90+ jours.",
    segments: ["workers_inactive"],
    locale: "auto",
    subject_fr: "Votre profil LEXPAT Connect vous attend",
    subject_en: "Your LEXPAT Connect profile is waiting for you",
  },
  {
    id: "custom",
    label: "Message personnalisé",
    description: "Envoyez un message libre sur n'importe quel segment.",
    segments: ["*"],
    locale: "fr",
    subject_fr: "",
    subject_en: "",
  },
];

// ─── GET — Historique ─────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const url = new URL(request.url);
    const page  = Math.max(1, parseInt(url.searchParams.get("page")  || "1",  10));
    const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10));
    const from  = (page - 1) * limit;

    const { data: campaigns, error, count } = await supabase
      .from("email_campaigns")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      templates: TEMPLATES,
      campaigns: campaigns || [],
      total: count || 0,
      page,
      limit,
    });

  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// ─── POST — Envoyer une campagne ──────────────────────────────────────────────

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const body = await request.json().catch(() => ({}));
    const {
      segment    = "workers_all",
      template   = "visibility_initial",
      subject    = "",
      name       = "",
      locale     = "auto",
      dry_run    = false,
      contact_ids = null,
      custom_html = null,  // pour template "custom"
    } = body;

    const resend  = new Resend(process.env.RESEND_API_KEY);
    const from    = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

    // 1. Récupérer les contacts via l'API CRM
    const crmUrl = new URL(`${baseUrl}/api/admin/crm`);
    crmUrl.searchParams.set("segment", segment);

    // Appel interne via Supabase directement (pas HTTP)
    const contacts = await resolveContacts(supabase, segment, baseUrl);

    // 2. Filtrer si une sélection manuelle est passée
    let targets = contacts;
    if (contact_ids && Array.isArray(contact_ids) && contact_ids.length > 0) {
      const idSet = new Set(contact_ids);
      targets = contacts.filter(c => idSet.has(c.id));
    }

    // 3. Vérifier les désinscriptions
    const { data: unsubs } = await supabase
      .from("email_unsubscribes")
      .select("email");
    const unsubSet = new Set((unsubs || []).map(u => u.email.toLowerCase()));

    const sent    = [];
    const skipped = [];
    const failed  = [];

    // 4. Envoyer à chaque contact
    for (const contact of targets) {
      if (!contact.email) {
        skipped.push({ id: contact.id, name: contact.name, reason: "no_email" });
        continue;
      }
      if (unsubSet.has(contact.email.toLowerCase())) {
        skipped.push({ email: contact.email, name: contact.name, reason: "unsubscribed" });
        continue;
      }

      const contactLocale = locale === "auto" ? (contact.locale || "fr") : locale;
      const isEn = contactLocale === "en";

      // Construire le sujet
      const resolvedSubject = subject || getDefaultSubject(template, contactLocale);

      // Construire le HTML selon le template
      let html;
      try {
        html = await buildEmailHtml({
          template,
          contact,
          supabase,
          baseUrl,
          locale: contactLocale,
          custom_html,
        });
      } catch (buildErr) {
        failed.push({ email: contact.email, name: contact.name, error: buildErr.message });
        continue;
      }

      if (dry_run) {
        sent.push({ email: contact.email, name: contact.name, locale: contactLocale, dry: true });
        continue;
      }

      // Envoi réel
      const { error: sendError } = await resend.emails.send({
        from,
        to: contact.email,
        subject: resolvedSubject,
        html,
      });

      if (sendError) {
        failed.push({ email: contact.email, name: contact.name, error: sendError.message });
      } else {
        sent.push({ email: contact.email, name: contact.name, locale: contactLocale });
      }
    }

    // 5. Enregistrer dans l'historique
    const campaignName = name || `${getTemplateLabel(template)} — ${segment} — ${new Date().toLocaleDateString("fr-BE")}`;
    const campaignStatus = failed.length > 0 && sent.length === 0 ? "error"
      : failed.length > 0 ? "partial"
      : "done";

    const { data: savedCampaign } = await supabase
      .from("email_campaigns")
      .insert({
        name: campaignName,
        segment,
        template,
        subject: subject || getDefaultSubject(template, locale === "auto" ? "fr" : locale),
        locale,
        dry_run,
        sent_count: sent.length,
        failed_count: failed.length,
        skipped_count: skipped.length,
        recipients: sent,
        failures: failed,
        status: campaignStatus,
        created_by: user.id,
      })
      .select()
      .single();

    return NextResponse.json({
      ok: true,
      dry_run,
      campaign_id: savedCampaign?.id,
      campaign_name: campaignName,
      total_targets: targets.length,
      sent: sent.length,
      skipped: skipped.length,
      failed: failed.length,
      recipients: sent,
      failures: failed,
      status: campaignStatus,
    });

  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTemplateLabel(templateId) {
  return TEMPLATES.find(t => t.id === templateId)?.label || templateId;
}

function getDefaultSubject(templateId, locale = "fr") {
  const t = TEMPLATES.find(t => t.id === templateId);
  if (!t) return "Message de LEXPAT Connect";
  return locale === "en" ? (t.subject_en || t.subject_fr) : t.subject_fr;
}

/**
 * Résout la liste des contacts pour un segment donné (logique inline)
 */
async function resolveContacts(supabase, segment, baseUrl) {
  const { getEffectiveWorkerProfileVisibility } = await import("../../../../lib/worker-profile-visibility.js");
  const { normalizeRegion } = await import("../../../../lib/matching.js");

  let contacts = [];

  if (segment.startsWith("workers_")) {
    const { data: workers, error } = await supabase
      .from("worker_profiles")
      .select("id, user_id, full_name, target_job, target_sector, preferred_region, experience_level, profile_visibility, profile_completion, created_at, updated_at, referral_code")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    let filtered = workers || [];

    if (segment === "workers_visible") {
      filtered = filtered.filter(w => getEffectiveWorkerProfileVisibility(w) === "visible");
    } else if (segment === "workers_hidden") {
      filtered = filtered.filter(w => getEffectiveWorkerProfileVisibility(w) === "hidden");
    } else if (segment === "workers_incomplete") {
      filtered = filtered.filter(w => !w.target_job?.trim() || !w.target_sector?.trim() || (w.profile_completion || 0) < 60);
    } else if (segment === "workers_recent") {
      filtered = filtered.filter(w => new Date(w.created_at) > thirtyDaysAgo);
    } else if (segment === "workers_inactive") {
      filtered = filtered.filter(w =>
        new Date(w.updated_at || w.created_at) < ninetyDaysAgo &&
        getEffectiveWorkerProfileVisibility(w) !== "visible"
      );
    }

    // Enrichir avec email
    for (const profile of filtered) {
      if (!profile.user_id) continue;
      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      const email = userData?.user?.email;
      if (!email) continue;
      const locale = userData?.user?.user_metadata?.preferred_locale === "en" ? "en" : "fr";
      contacts.push({
        id: profile.id,
        user_id: profile.user_id,
        type: "worker",
        name: profile.full_name || email,
        email,
        job: profile.target_job || null,
        sector: profile.target_sector || null,
        region: normalizeRegion(profile.preferred_region),
        visibility: getEffectiveWorkerProfileVisibility(profile),
        completion: profile.profile_completion || 0,
        referral_code: profile.referral_code || null,
        locale,
        created_at: profile.created_at,
      });
    }

  } else if (segment.startsWith("employers_")) {
    const { data: employers } = await supabase
      .from("employer_profiles")
      .select("id, company_name, created_at")
      .order("created_at", { ascending: false });

    const { data: members } = await supabase
      .from("employer_members")
      .select("employer_profile_id, user_id, full_name, work_email, is_owner, created_at")
      .eq("is_owner", true);

    const { data: offers } = await supabase
      .from("job_offers")
      .select("employer_profile_id, status");

    const offerMap = new Map();
    (offers || []).forEach(o => {
      if (o.status === "published") {
        offerMap.set(o.employer_profile_id, (offerMap.get(o.employer_profile_id) || 0) + 1);
      }
    });

    const memberMap = new Map((members || []).map(m => [m.employer_profile_id, m]));
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let filtered = employers || [];

    if (segment === "employers_with_offers") {
      filtered = filtered.filter(e => (offerMap.get(e.id) || 0) > 0);
    } else if (segment === "employers_without_offers") {
      filtered = filtered.filter(e => (offerMap.get(e.id) || 0) === 0);
    } else if (segment === "employers_recent") {
      filtered = filtered.filter(e => new Date(e.created_at) > thirtyDaysAgo);
    }

    contacts = filtered.map(emp => {
      const member = memberMap.get(emp.id);
      return {
        id: emp.id,
        user_id: member?.user_id || null,
        type: "employer",
        name: emp.company_name || "Entreprise",
        email: member?.work_email || null,
        offersCount: offerMap.get(emp.id) || 0,
        locale: "fr",
        created_at: emp.created_at,
      };
    }).filter(c => c.email);
  }

  return contacts;
}

/**
 * Construit le HTML de l'email selon le template et le contact
 */
async function buildEmailHtml({ template, contact, supabase, baseUrl, locale, custom_html }) {
  const isEn = locale === "en";
  const unsubUrl = getUnsubscribeUrl(contact.email);

  // URL de l'espace membre selon le type et la locale
  const spaceUrl = contact.type === "employer"
    ? `${baseUrl}${isEn ? "/en/employeurs/espace" : "/employeurs/espace"}`
    : `${baseUrl}${isEn ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;

  if (template === "custom") {
    // Assurer un code de parrainage si le contact est un travailleur
    let referralUrl = "";
    if (contact.type === "worker") {
      let referral_code = contact.referral_code;
      if (!referral_code) {
        try {
          referral_code = await generateUniqueReferralCode(supabase);
          await supabase.from("worker_profiles").update({ referral_code }).eq("id", contact.id);
        } catch { referral_code = null; }
      }
      if (referral_code) referralUrl = buildReferralUrl(referral_code, locale);
    }

    const bodyText = (custom_html || "")
      .replace(/\{\{name\}\}/g, contact.name || "")
      .replace(/\{\{email\}\}/g, contact.email || "")
      .replace(/\{\{profile_url\}\}/g, spaceUrl)
      .replace(/\{\{referral_url\}\}/g, referralUrl || spaceUrl);

    return customCampaignEmailHtml({
      locale,
      bodyText,
      recipientEmail: contact.email,
    });
  }

  if (template === "visibility_initial" || template === "visibility_reminder") {
    const isReminder = template === "visibility_reminder";

    // Assurer un code de parrainage
    let referral_code = contact.referral_code;
    if (!referral_code && contact.type === "worker") {
      try {
        referral_code = await generateUniqueReferralCode(supabase);
        await supabase
          .from("worker_profiles")
          .update({ referral_code })
          .eq("id", contact.id);
      } catch {
        referral_code = null;
      }
    }

    const referralUrl = referral_code
      ? buildReferralUrl(referral_code, locale)
      : `${baseUrl}${isEn ? "/en/inscription" : "/inscription"}`;

    return workerVisibilityPriorityEmailHtml({
      locale,
      recipientName: contact.name,
      profileUrl: spaceUrl,
      referralUrl,
      recipientEmail: contact.email,
      reminder: isReminder,
    });
  }

  if (template === "complete_profile") {
    return workerProfileIncompleteEmailHtml({
      locale,
      recipientName: contact.name,
      profileUrl: spaceUrl,
      recipientEmail: contact.email,
    });
  }

  if (template === "employer_publish_offer") {
    return employerPublishOfferEmailHtml({
      locale,
      recipientName: contact.name,
      companyName: contact.name,
      spaceUrl,
      recipientEmail: contact.email,
    });
  }

  if (template === "inactivity_reminder") {
    return inactivityReminderEmailHtml({
      locale,
      recipientName: contact.name,
      profileUrl: spaceUrl,
      recipientEmail: contact.email,
    });
  }

  // Fallback : template générique
  return genericCampaignEmailHtml({
    locale,
    recipientName: contact.name,
    spaceUrl,
    recipientEmail: contact.email,
  });
}
