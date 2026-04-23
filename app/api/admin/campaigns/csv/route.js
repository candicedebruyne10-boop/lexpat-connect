/**
 * POST /api/admin/campaigns/csv
 *
 * Envoi d'une campagne email à partir d'un fichier CSV.
 *
 * Form-data attendu :
 *   - csv       : File (texte CSV)
 *   - subject   : string
 *   - body      : string (HTML ou texte avec variables {{prenom}}, {{nom}},
 *                 {{email}}, {{societe}}, {{ville}}, {{pays}}, {{occupation}})
 *   - name      : string (nom de la campagne, optionnel)
 *   - dry_run   : "true" | "false"
 *   - locale    : "fr" | "en" (langue par défaut si colonne Langue absente)
 *
 * Colonnes CSV reconnues (insensibles à la casse, espaces ignorés) :
 *   Prénom | Nom de famille | E-mail 1 | Téléphone 1 |
 *   Adresse 1 - Ville | Adresse 1 - État/Région | Adresse 1 - Pays |
 *   Numéro de TVA | Société | Occupation | Libellés | Source | Langue |
 *   Numéro entreprise | Précision
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import { customCampaignEmailHtml } from "../../../../../lib/email-templates";
import { getUnsubscribeUrl } from "../../../../../lib/email-unsubscribe";

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

// ── Parseur CSV minimal (supporte les guillemets) ───────────────────────────

function parseCSV(text) {
  // Strip UTF-8 BOM if present (Excel on Windows/Mac exports)
  const cleaned = text.replace(/^\uFEFF/, "");
  const lines = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (!lines.length) return [];

  // Auto-detect delimiter from the header row
  const firstLine = lines[0];
  const counts = { ",": 0, ";": 0, "\t": 0 };
  let inQD = false;
  for (const ch of firstLine) {
    if (ch === '"') inQD = !inQD;
    else if (!inQD && counts[ch] !== undefined) counts[ch]++;
  }
  const sep = counts[";"] > counts[","] && counts[";"] > counts["\t"] ? ";"
    : counts["\t"] > counts[","] ? "\t"
    : ",";

  const parseLine = (line) => {
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === sep && !inQuote) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, " ").trim());

  const normalize = (h) => h.toLowerCase().replace(/\s+/g, " ").trim();

  const findCol = (h, ...aliases) => {
    const normalized = normalize(h);
    return aliases.some(a => normalize(a) === normalized);
  };

  const colIndex = (aliases) => {
    for (let i = 0; i < headers.length; i++) {
      if (aliases.some(a => normalize(a) === headers[i])) return i;
    }
    return -1;
  };

  const iPrenom    = colIndex(["prénom", "prenom", "first name", "firstname"]);
  const iNom       = colIndex(["nom de famille", "nom", "last name", "lastname"]);
  const iEmail     = colIndex(["e-mail 1", "email 1", "email", "e-mail", "mail"]);
  const iTel       = colIndex(["téléphone 1", "telephone 1", "tel", "phone"]);
  const iVille     = colIndex(["adresse 1 - ville", "ville", "city"]);
  const iRegion    = colIndex(["adresse 1 - état/région", "adresse 1 - etat/region", "région", "region", "state"]);
  const iPays      = colIndex(["adresse 1 - pays", "pays", "country"]);
  const iTva       = colIndex(["numéro de tva", "numero de tva", "tva", "vat"]);
  const iSociete   = colIndex(["société", "societe", "company", "entreprise"]);
  const iOccup     = colIndex(["occupation", "poste", "job"]);
  const iLabels    = colIndex(["libellés", "libelles", "labels", "tags"]);
  const iSource    = colIndex(["source"]);
  const iLangue    = colIndex(["langue", "language", "lang"]);
  const iNumEnt    = colIndex(["numéro entreprise", "numero entreprise", "enterprise number", "company number"]);
  const iPrecision = colIndex(["précision", "precision", "notes", "note"]);

  const contacts = [];

  for (let r = 1; r < lines.length; r++) {
    const line = lines[r].trim();
    if (!line) continue;
    const cols = parseLine(line);
    const get = (idx) => (idx >= 0 ? (cols[idx] || "").trim() : "");

    const email = get(iEmail);
    if (!email || !email.includes("@")) continue;

    contacts.push({
      email,
      prenom:    get(iPrenom),
      nom:       get(iNom),
      name:      [get(iPrenom), get(iNom)].filter(Boolean).join(" ") || email,
      telephone: get(iTel),
      ville:     get(iVille),
      region:    get(iRegion),
      pays:      get(iPays),
      tva:       get(iTva),
      societe:   get(iSociete),
      occupation:get(iOccup),
      labels:    get(iLabels),
      source:    get(iSource),
      langue:    get(iLangue).toLowerCase() || null,
      numEntreprise: get(iNumEnt),
      precision: get(iPrecision),
    });
  }

  return contacts;
}

// ── Remplacement des variables dans le corps ────────────────────────────────

function applyVariables(template, contact) {
  return template
    .replace(/\{\{prenom\}\}/gi,     contact.prenom     || contact.name || "")
    .replace(/\{\{nom\}\}/gi,        contact.nom        || "")
    .replace(/\{\{name\}\}/gi,       contact.name       || "")
    .replace(/\{\{email\}\}/gi,      contact.email      || "")
    .replace(/\{\{societe\}\}/gi,    contact.societe    || "")
    .replace(/\{\{ville\}\}/gi,      contact.ville      || "")
    .replace(/\{\{pays\}\}/gi,       contact.pays       || "")
    .replace(/\{\{occupation\}\}/gi, contact.occupation || "")
    .replace(/\{\{telephone\}\}/gi,  contact.telephone  || "")
    .replace(/\{\{region\}\}/gi,     contact.region     || "")
    .replace(/\{\{precision\}\}/gi,  contact.precision  || "");
}

// ── Handler principal ───────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const formData = await request.formData();
    const csvFile  = formData.get("csv");
    const subject  = (formData.get("subject") || "").trim();
    const bodyTpl  = (formData.get("body")    || "").trim();
    const name     = (formData.get("name")    || "").trim();
    const isDryRun = formData.get("dry_run") === "true";
    const defaultLocale = formData.get("locale") || "fr";
    const batchSize   = parseInt(formData.get("batch_size")   || "0") || 0;
    const batchOffset = parseInt(formData.get("batch_offset") || "0") || 0;

    // Identifiant unique de campagne (pour le tracking d'ouverture)
    const campaignId = crypto.randomUUID();

    if (!csvFile || typeof csvFile === "string") {
      return NextResponse.json({ error: "Aucun fichier CSV fourni." }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "Le sujet de l'email est obligatoire." }, { status: 400 });
    }
    if (!bodyTpl) {
      return NextResponse.json({ error: "Le corps de l'email est obligatoire." }, { status: 400 });
    }

    const csvText  = await csvFile.text();
    const allContacts = parseCSV(csvText);
    if (!allContacts.length) {
      return NextResponse.json({ error: "Aucun contact valide trouvé dans le CSV (colonne E-mail 1 obligatoire)." }, { status: 400 });
    }

    // Découpe en lot si batch_size est précisé
    const contacts = batchSize > 0
      ? allContacts.slice(batchOffset, batchOffset + batchSize)
      : allContacts;

    if (!contacts.length) {
      return NextResponse.json({ error: "Lot vide — tous les contacts de ce fichier ont déjà été envoyés." }, { status: 400 });
    }

    // Vérifier les désinscriptions
    const { data: unsubs } = await supabase.from("email_unsubscribes").select("email");
    const unsubSet = new Set((unsubs || []).map(u => u.email.toLowerCase()));

    const resend  = new Resend(process.env.RESEND_API_KEY);
    const from    = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

    const sent    = [];
    const skipped = [];
    const failed  = [];

    for (const contact of contacts) {
      if (unsubSet.has(contact.email.toLowerCase())) {
        skipped.push({ email: contact.email, name: contact.name, reason: "unsubscribed" });
        continue;
      }

      const locale  = (contact.langue === "en" || contact.langue === "nl") ? "en" : defaultLocale;
      const bodyText = applyVariables(bodyTpl, contact);

      const html = customCampaignEmailHtml({
        locale,
        bodyText,
        recipientEmail: contact.email,
        campaignId,
      });

      if (isDryRun) {
        sent.push({ email: contact.email, name: contact.name, locale, dry: true });
        continue;
      }

      // Throttle : 250 ms entre chaque envoi (limite Resend 5/sec)
      await new Promise(r => setTimeout(r, 250));

      const { error: sendError } = await resend.emails.send({
        from,
        to: contact.email,
        subject: applyVariables(subject, contact),
        html,
      });

      if (sendError) {
        if (sendError.message?.includes("Too many requests")) {
          await new Promise(r => setTimeout(r, 1200));
          const { error: retryErr } = await resend.emails.send({
            from,
            to: contact.email,
            subject: applyVariables(subject, contact),
            html,
          });
          if (retryErr) {
            failed.push({ email: contact.email, name: contact.name, error: retryErr.message });
          } else {
            sent.push({ email: contact.email, name: contact.name, locale });
          }
        } else {
          failed.push({ email: contact.email, name: contact.name, error: sendError.message });
        }
      } else {
        sent.push({ email: contact.email, name: contact.name, locale });
      }
    }

    // Enregistrer dans l'historique
    const campaignName = name || `Campagne CSV — ${new Date().toLocaleDateString("fr-BE")}`;
    const status = failed.length > 0 && sent.length === 0 ? "error"
      : failed.length > 0 ? "partial"
      : "done";

    await supabase.from("email_campaigns").insert({
      name: campaignName,
      segment: "csv_import",
      template: "csv_custom",
      subject,
      locale: defaultLocale,
      dry_run: isDryRun,
      sent_count: sent.length,
      failed_count: failed.length,
      skipped_count: skipped.length,
      recipients: sent,
      failures: failed,
      status,
      created_by: user.id,
    });

    return NextResponse.json({
      ok: true,
      dry_run: isDryRun,
      campaign_id: campaignId,
      campaign_name: campaignName,
      total_in_file: allContacts.length,
      total_in_batch: contacts.length,
      batch_offset: batchOffset,
      batch_size: batchSize,
      remaining: Math.max(0, allContacts.length - batchOffset - contacts.length),
      sent: sent.length,
      skipped: skipped.length,
      failed: failed.length,
      recipients: sent,
      failures: failed,
      status,
    });

  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
