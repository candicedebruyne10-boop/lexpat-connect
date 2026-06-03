import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";

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

// Normalise la région pour regrouper les variantes
function normalizeRegion(r) {
  if (!r) return "Non renseignée";
  const v = r.toLowerCase();
  if (v.includes("bruxelles") || v.includes("brussels") || v.includes("capitale")) return "Bruxelles-Capitale";
  if (v.includes("flandre") || v.includes("flanders") || v.includes("vlaand")) return "Flandre";
  if (v.includes("wallon") || v.includes("wallonie") || v.includes("liège") || v.includes("namur") || v.includes("charleroi")) return "Wallonie";
  return r;
}

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    // ── 1. Récupérer les profils visibles ────────────────────────────────────
    const { data: profiles, error } = await supabase
      .from("worker_profiles")
      .select("target_job, target_sector, preferred_region, experience_level, languages")
      .eq("profile_visibility", "visible")
      .not("target_job", "is", null)
      .not("target_sector", "is", null);

    if (error) throw error;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ ok: true, recommendations: [], profileCount: 0, summary: null });
    }

    // ── 2. Agréger : secteurs, régions, métiers ──────────────────────────────
    const bySector = {};
    const byRegion = {};
    const byJob = {};

    for (const p of profiles) {
      const sector = p.target_sector || "Autre";
      const region = normalizeRegion(p.preferred_region);
      const job = p.target_job || "Autre";

      bySector[sector] = (bySector[sector] || 0) + 1;
      byRegion[region] = (byRegion[region] || 0) + 1;
      byJob[job] = (byJob[job] || 0) + 1;
    }

    const topSectors = Object.entries(bySector).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topRegions = Object.entries(byRegion).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const topJobs = Object.entries(byJob).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // ── 3. Construire le contexte pour Claude ────────────────────────────────
    const profileSummary = [
      `Profils disponibles sur LEXPAT Connect : ${profiles.length} au total.`,
      `Top secteurs : ${topSectors.map(([s, n]) => `${s} (${n})`).join(", ")}.`,
      `Top régions : ${topRegions.map(([r, n]) => `${r} (${n})`).join(", ")}.`,
      `Top métiers : ${topJobs.map(([j, n]) => `${j} (${n})`).join(", ")}.`,
    ].join("\n");

    const systemPrompt = `Tu es une conseillère en stratégie commerciale B2B spécialisée dans le recrutement international en Belgique.
Tu aides Candice Debruyne, fondatrice de LEXPAT Connect (cabinet d'avocats LEXPAT + plateforme de matching).
Tu connais le marché belge, les métiers en pénurie (listes Actiris, Forem, VDAB 2026), et les secteurs qui peinent à recruter.
Réponds toujours en JSON strict, sans markdown ni commentaire.`;

    const userPrompt = `Voici les profils de travailleurs internationaux actuellement disponibles sur LEXPAT Connect :

${profileSummary}

Génère 4 recommandations stratégiques de ciblage employeurs.
Pour chaque recommandation, identifie :
- Le type d'employeurs belges à contacter EN PREMIER (secteur, taille, région)
- Pourquoi ce segment est prioritaire (tension de recrutement, adéquation avec les profils)
- Un argument commercial court et percutant (1-2 phrases, à utiliser dans un email ou LinkedIn DM)
- Le canal de prospection recommandé (LinkedIn, email froid, salon, partenaire RH, etc.)
- Une action concrète immédiate (ex: "Recherche LinkedIn : 'DRH construction Liège'")

Réponds UNIQUEMENT avec ce JSON :
{
  "recommendations": [
    {
      "id": "1",
      "priority": "haute" | "moyenne",
      "segment": "Nom court du segment (ex: PME tech bruxelloises)",
      "region": "Région principale",
      "sector": "Secteur",
      "why": "Pourquoi ce segment maintenant (1 phrase)",
      "pitch": "Argument commercial prêt à l'emploi",
      "channel": "Canal recommandé",
      "action": "Action concrète immédiate",
      "profileMatch": "Combien de profils correspondent approximativement"
    }
  ]
}`;

    // ── 4. Appeler Claude ────────────────────────────────────────────────────
    let recommendations = [];

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (anthropicKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
          max_tokens: 1200,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
        cache: "no-store",
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text?.trim() || "";
      const parsed = JSON.parse(raw);
      recommendations = parsed.recommendations || [];
    } else if (openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
        cache: "no-store",
      });
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "";
      const parsed = JSON.parse(raw);
      recommendations = parsed.recommendations || [];
    } else {
      // Fallback statique si pas d'IA configurée
      recommendations = [{
        id: "1",
        priority: "haute",
        segment: "PME industrielles flamandes",
        region: "Flandre",
        sector: topSectors[0]?.[0] || "Industrie",
        why: "La Flandre concentre le plus de profils disponibles et les listes VDAB 2026 sont les plus larges.",
        pitch: "J'ai des profils qualifiés disponibles maintenant dans votre secteur. Permis unique géré si nécessaire.",
        channel: "LinkedIn DM",
        action: "Recherche LinkedIn : 'DRH OR responsable RH' + secteur + région",
        profileMatch: `${topSectors[0]?.[1] || 0} profils`,
      }];
    }

    return NextResponse.json({
      ok: true,
      profileCount: profiles.length,
      topSectors,
      topRegions,
      topJobs,
      recommendations,
    });

  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
