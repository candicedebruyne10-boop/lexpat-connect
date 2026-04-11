/**
 * LEXPAT Connect — Templates email HTML
 * Tous les emails sortants utilisent ces fonctions pour garantir
 * une présentation cohérente, professionnelle et lisible.
 */

import { getUnsubscribeUrl } from "./email-unsubscribe";

function escapeHtml(value) {
  if (!value) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Template de base — enveloppe commune à tous les emails LEXPAT Connect
 * @param {string} title - Titre de l'email (balise <title>)
 * @param {string} preheader - Texte de prévisualisation (invisible dans l'email)
 * @param {string} body - Corps HTML de l'email
 * @param {string|null} unsubscribeUrl - URL de désinscription RGPD (null pour emails internes)
 */
function baseTemplate({
  title,
  preheader = "",
  body,
  unsubscribeUrl = null,
  locale = "fr",
  preferencesUrl = null
}) {
  const isEn = locale === "en";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
  const contactEmail = "contact@lexpat-connect.be";
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Open Sans',Arial,Helvetica,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#f4f7fb;">${escapeHtml(preheader)}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,58,120,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A78 0%,#204E97 100%);padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;vertical-align:middle;">
                          <img src="${base}/logo-lexpat-connect.png" alt="LEXPAT Connect" width="44" height="44" style="display:block;border-radius:12px;" />
                        </td>
                        <td style="vertical-align:middle;">
                          <span style="display:block;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">LEXPAT</span>
                          <span style="display:block;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:#57B7AF;letter-spacing:3px;">CONNECT</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:rgba(255,255,255,0.6);">lexpat-connect.be</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 28px;">
              ${body}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafb;border-top:1px solid #e4edf4;padding:20px 40px;">
              <p style="margin:0 0 8px;font-size:11px;color:#8ea1bb;line-height:1.6;">
                ${isEn
                  ? `This email was sent automatically from <strong>LEXPAT Connect</strong>.<br />Questions: <a href="mailto:${contactEmail}" style="color:#57B7AF;text-decoration:none;">${contactEmail}</a> — <a href="${base}" style="color:#57B7AF;text-decoration:none;">lexpat-connect.be</a>`
                  : `Cet email a été envoyé automatiquement depuis <strong>LEXPAT Connect</strong>.<br />Pour toute question : <a href="mailto:${contactEmail}" style="color:#57B7AF;text-decoration:none;">${contactEmail}</a> — <a href="${base}" style="color:#57B7AF;text-decoration:none;">lexpat-connect.be</a>`}
              </p>
              ${unsubscribeUrl ? `
              <p style="margin:0;font-size:10px;color:#b0bec9;line-height:1.6;border-top:1px solid #e4edf4;padding-top:8px;">
                ${isEn
                  ? `🔒 <strong>Privacy</strong> — You are receiving this email because you enabled alerts on LEXPAT Connect. ${preferencesUrl ? `<a href="${preferencesUrl}" style="color:#8ea1bb;text-decoration:underline;">Manage email preferences</a> · ` : ""}<a href="${unsubscribeUrl}" style="color:#8ea1bb;text-decoration:underline;">Unsubscribe from these alerts</a>.`
                  : `🔒 <strong>RGPD</strong> — Vous recevez cet email car vous avez activé des alertes sur LEXPAT Connect. ${preferencesUrl ? `<a href="${preferencesUrl}" style="color:#8ea1bb;text-decoration:underline;">Gérer mes préférences email</a> · ` : ""}<a href="${unsubscribeUrl}" style="color:#8ea1bb;text-decoration:underline;">Me désinscrire de ces notifications</a>.`}
              </p>` : ""}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Ligne de données dans un tableau de récapitulatif
 */
function infoRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px 10px 0;border-bottom:1px solid #e4edf4;font-size:13px;font-weight:600;color:#1E3A78;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e4edf4;font-size:13px;color:#3d5066;vertical-align:top;">${String(value).replaceAll("\n", "<br />")}</td>
    </tr>`;
}

/**
 * Titre de section dans le corps d'un email
 */
function sectionTitle(text) {
  return `<h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1E3A78;">${escapeHtml(text)}</h2>`;
}

/**
 * Paragraphe standard
 */
function paragraph(text) {
  return `<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${text}</p>`;
}

/**
 * Badge coloré (ex: statut, urgence)
 */
function badge(text, color = "#57B7AF") {
  return `<span style="display:inline-block;background:${color}1a;color:${color};border:1px solid ${color}40;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;">${escapeHtml(text)}</span>`;
}

/**
 * Bouton CTA
 */
function ctaButton(label, href) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#1E3A78 0%,#204E97 100%);border-radius:10px;">
          <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`;
}

function secondaryLink(label, href, color = "#B5121B") {
  return `<a href="${href}" style="display:inline-block;margin-right:16px;margin-top:8px;font-size:13px;font-weight:700;color:${color};text-decoration:none;">${escapeHtml(label)} →</a>`;
}

/**
 * Séparateur horizontal
 */
function divider() {
  return `<hr style="border:none;border-top:1px solid #e4edf4;margin:24px 0;" />`;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATES SPÉCIFIQUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Email notification — Nouvelle offre d'emploi publiée par un employeur
 */
export function newOfferEmailHtml({ title, sector, region, contract, urgency, description, companyName }) {
  const body = `
    ${sectionTitle("Nouvelle offre d'emploi publiée")}
    ${paragraph(`Un employeur vient de publier une nouvelle offre sur <strong>LEXPAT Connect</strong>. Voici le récapitulatif :`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow("Intitulé du poste", title)}
        ${companyName ? infoRow("Entreprise", companyName) : ""}
        ${infoRow("Secteur", sector)}
        ${infoRow("Région", region)}
        ${infoRow("Type de contrat", contract)}
        ${infoRow("Urgence", urgency)}
      </tbody>
    </table>

    ${description ? `
    <div style="background:#f8fafb;border-left:3px solid #57B7AF;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#57B7AF;letter-spacing:0.1em;text-transform:uppercase;">Description du poste</p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#3d5066;">${escapeHtml(description)}</p>
    </div>` : ""}

    ${ctaButton("Voir l'offre sur LEXPAT Connect", "https://lexpat-connect.be/connexion")}
  `;

  return baseTemplate({
    title: `Nouvelle offre : ${title}`,
    preheader: `${companyName || "Un employeur"} recherche un(e) ${title} — ${sector} — ${region}`,
    body
  });
}

export function offerPublishedConfirmationEmailHtml({
  locale = "fr",
  title,
  sector,
  region,
  contract,
  urgency,
  profileUrl,
  recipientEmail
}) {
  const isEn = locale === "en";

  const body = `
    ${sectionTitle(isEn ? "Your opening is now live on LEXPAT Connect" : "Votre offre est maintenant publiée sur LEXPAT Connect")}
    ${paragraph(
      isEn
        ? "Your opening has been saved and published successfully. It is now visible in the platform and can be picked up by the matching engine."
        : "Votre offre a bien été enregistrée et publiée. Elle est désormais visible sur la plateforme et peut être prise en compte par le moteur de matching."
    )}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow(isEn ? "Role" : "Poste", title)}
        ${infoRow(isEn ? "Sector" : "Secteur", sector)}
        ${infoRow(isEn ? "Region" : "Région", region)}
        ${infoRow(isEn ? "Contract type" : "Type de contrat", contract)}
        ${infoRow(isEn ? "Urgency" : "Urgence", urgency)}
      </tbody>
    </table>

    <div style="background:#f0faf9;border:1px solid #57B7AF40;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#1E3A78;line-height:1.6;">
        ${isEn
          ? "You can now review matching worker profiles directly from your employer space."
          : "Vous pouvez désormais consulter les profils travailleurs correspondants directement depuis votre espace employeur."}
      </p>
    </div>

    ${ctaButton(isEn ? "View my openings" : "Voir mes offres", profileUrl)}
  `;

  return baseTemplate({
    title: isEn ? `Opening published — ${title}` : `Offre publiée — ${title}`,
    preheader: isEn
      ? `Your opening for ${title} is now live on LEXPAT Connect.`
      : `Votre offre pour ${title} est maintenant publiée sur LEXPAT Connect.`,
    body,
    locale,
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail)
  });
}

/**
 * Email notification — Formulaire de contact générique
 */
export function contactFormEmailHtml({ formTitle, formType, fields }) {
  const rows = fields
    .filter((f) => f.value)
    .map((f) => infoRow(f.label, f.value))
    .join("");

  const body = `
    ${sectionTitle(formTitle || "Nouveau message reçu")}
    ${paragraph(`Vous avez reçu un nouveau message via le formulaire <strong>${escapeHtml(formType || "de contact")}</strong> sur LEXPAT Connect.`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>${rows}</tbody>
    </table>

    ${divider()}
    ${paragraph(`<em style="font-size:12px;color:#8ea1bb;">Répondez directement à cet email pour contacter l'expéditeur.</em>`)}
  `;

  return baseTemplate({
    title: formTitle || "Nouveau message — LEXPAT Connect",
    preheader: `Nouveau message reçu via ${formType || "le formulaire de contact"}`,
    body
  });
}

/**
 * Email notification — Retour testeur
 */
export function testFeedbackEmailHtml({ testerName, pageLabel, feedbackType, priority, device, browser, summary, details, expectedResult, suggestedFix }) {
  const urgencyColor = priority === "Bloquant" ? "#B5121B" : priority === "Important" ? "#d97706" : "#57B7AF";

  const body = `
    ${sectionTitle("Nouveau retour testeur")}
    ${paragraph(`<strong>${escapeHtml(testerName || "Un testeur")}</strong> a soumis un retour depuis la page <strong>${escapeHtml(pageLabel)}</strong>.`)}

    <div style="margin-bottom:20px;">
      ${badge(feedbackType || "Retour", "#204E97")}
      &nbsp;
      ${badge(priority || "À améliorer", urgencyColor)}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow("Testeur", testerName)}
        ${infoRow("Page", pageLabel)}
        ${infoRow("Type", feedbackType)}
        ${infoRow("Priorité", priority)}
        ${infoRow("Appareil", device)}
        ${infoRow("Navigateur", browser)}
        ${infoRow("Résumé", summary)}
        ${infoRow("Observation", details)}
        ${infoRow("Comportement attendu", expectedResult)}
        ${infoRow("Suggestion", suggestedFix)}
      </tbody>
    </table>

    ${ctaButton("Voir les retours testeurs", "https://lexpat-connect.be/retours-test")}
  `;

  return baseTemplate({
    title: `Retour testeur — ${pageLabel}`,
    preheader: `${testerName} a signalé : ${summary}`,
    body
  });
}

/**
 * Email envoyé à l'EMPLOYEUR — Un nouveau candidat correspond à son offre
 * @param {string} recipientEmail - Email de l'employeur (pour lien désinscription RGPD)
 */
export function newWorkerMatchEmailHtml({ targetJob, sector, region, experience, offerTitle, recipientEmail }) {
  const body = `
    ${sectionTitle("Un nouveau candidat correspond à votre offre 🎯")}
    ${paragraph(`Un travailleur vient de compléter son profil sur <strong>LEXPAT Connect</strong> et correspond à votre offre <strong>${escapeHtml(offerTitle || targetJob || "")}</strong>. Connectez-vous pour consulter son dossier.`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow("Poste visé", targetJob)}
        ${infoRow("Secteur", sector)}
        ${infoRow("Région souhaitée", region)}
        ${infoRow("Niveau d'expérience", experience)}
      </tbody>
    </table>

    <div style="background:#f0faf9;border:1px solid #57B7AF40;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#1E3A78;line-height:1.6;">
        💡 <strong>Pour protéger la vie privée des candidats</strong>, les coordonnées complètes sont disponibles uniquement après connexion à votre espace employeur.
      </p>
    </div>

    ${ctaButton("Voir les candidats correspondants", "https://lexpat-connect.be/connexion")}
  `;

  return baseTemplate({
    title: `Nouveau candidat potentiel — ${offerTitle || targetJob}`,
    preheader: `Un candidat pour le poste de ${targetJob} (${sector}) vient de rejoindre LEXPAT Connect`,
    body,
    locale: "fr",
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail)
  });
}

/**
 * Email envoyé au TRAVAILLEUR — Une nouvelle offre correspond à son profil
 * @param {string} recipientEmail - Email du travailleur (pour lien désinscription RGPD)
 */
export function newOfferMatchEmailHtml({ jobTitle, companyName, sector, region, contractType, urgency, recipientEmail }) {
  const urgencyColor = urgency === "Urgent" ? "#B5121B" : urgency === "Élevée" ? "#d97706" : "#57B7AF";

  const body = `
    ${sectionTitle("Une offre correspond à votre profil ✨")}
    ${paragraph(`Un employeur vient de publier une offre qui correspond à votre profil sur <strong>LEXPAT Connect</strong>. Ne manquez pas cette opportunité !`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow("Poste", jobTitle)}
        ${companyName ? infoRow("Secteur d'activité", sector) : infoRow("Secteur", sector)}
        ${infoRow("Région", region)}
        ${infoRow("Type de contrat", contractType)}
      </tbody>
    </table>

    ${urgency ? `<div style="margin-bottom:20px;">${badge(urgency === "Urgent" ? "⚡ Recrutement urgent" : urgency, urgencyColor)}</div>` : ""}

    <div style="background:#f0faf9;border:1px solid #57B7AF40;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#1E3A78;line-height:1.6;">
        👋 L'employeur peut vous contacter directement via LEXPAT Connect si votre profil est visible. Assurez-vous que votre profil est complet pour maximiser vos chances.
      </p>
    </div>

    ${ctaButton("Voir mes offres correspondantes", "https://lexpat-connect.be/connexion")}
  `;

  return baseTemplate({
    title: `Nouvelle offre pour vous — ${jobTitle}`,
    preheader: `Une offre de ${jobTitle} (${sector} — ${region}) vient d'être publiée sur LEXPAT Connect`,
    body,
    locale: "fr",
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail)
  });
}

export function workerProfileIncompleteEmailHtml({
  locale = "fr",
  recipientName,
  profileUrl,
  recipientEmail
}) {
  const isEn = locale === "en";

  const body = `
    ${sectionTitle(isEn ? "Your profile is saved, but not yet visible" : "Votre profil est enregistré, mais pas encore visible")}
    ${paragraph(
      isEn
        ? `Hello${recipientName ? ` ${escapeHtml(recipientName)}` : ""},`
        : `Bonjour${recipientName ? ` ${escapeHtml(recipientName)}` : ""},`
    )}
    ${paragraph(
      isEn
        ? "Your LEXPAT Connect profile has been saved. It cannot be published to employers yet because some key matching information is still missing."
        : "Votre profil LEXPAT Connect a bien été enregistré. Il ne peut pas encore être publié auprès des employeurs, car certaines informations clés pour le matching sont encore manquantes."
    )}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow(isEn ? "To make your profile visible" : "Pour rendre votre profil visible", isEn
          ? "Add at least your target job and your target sector."
          : "Renseignez au minimum votre métier recherché et votre secteur visé.")}
      </tbody>
    </table>

    ${paragraph(
      isEn
        ? "You can also improve your visibility by adding your preferred region, experience level and a short presentation."
        : "Vous pouvez aussi améliorer votre visibilité en ajoutant votre région souhaitée, votre niveau d’expérience et une courte présentation."
    )}

    ${ctaButton(isEn ? "Complete my profile" : "Compléter mon profil", profileUrl)}

    ${paragraph(
      isEn
        ? `If you have a technical issue, contact us at <a href="mailto:contact@lexpat-connect.be" style="color:#204E97;text-decoration:none;">contact@lexpat-connect.be</a>.`
        : `Si vous rencontrez une difficulté technique, vous pouvez nous écrire à <a href="mailto:contact@lexpat-connect.be" style="color:#204E97;text-decoration:none;">contact@lexpat-connect.be</a>.`
    )}
  `;

  return baseTemplate({
    title: isEn ? "Complete your profile to make it visible" : "Complétez votre profil pour le rendre visible",
    preheader: isEn
      ? "Your profile is saved, but cannot be published yet."
      : "Votre profil est enregistré, mais ne peut pas encore être publié.",
    body,
    locale,
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail)
  });
}

function renderDigestCard(cardTitle, rowsHtml, badgeText = null) {
  return `
    <div style="border:1px solid #e4edf4;border-radius:18px;padding:18px 18px 8px;margin-bottom:16px;background:#ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;color:#1E3A78;padding-bottom:6px;">${escapeHtml(cardTitle)}</td>
          <td align="right" style="padding-bottom:6px;">${badgeText ? badge(badgeText, "#204E97") : ""}</td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tbody>${rowsHtml}</tbody></table>
    </div>`;
}

function digestInfoRow(label, value) {
  return infoRow(label, value);
}

export function newEmployerMatchDigestEmailHtml({
  locale = "fr",
  rows = [],
  matchedOfferTitle,
  primaryCtaUrl,
  simulatorUrl,
  legalSupportUrl,
  preferencesUrl,
  recipientEmail
}) {
  const isEn = locale === "en";
  const intro = isEn
    ? "A new profile has just joined LEXPAT Connect and aligns with the criteria you saved."
    : "Un nouveau profil vient de rejoindre LEXPAT Connect et correspond aux critères que vous avez enregistrés.";
  const subtitle = isEn
    ? "You can reach out directly from your secure LEXPAT Connect messaging space."
    : "Vous pouvez contacter ce talent directement depuis votre messagerie sécurisée LEXPAT Connect.";

  const cards = rows
    .map((row) =>
      renderDigestCard(
        row.title,
        [
          digestInfoRow(isEn ? "Location" : "Localisation", row.location),
          digestInfoRow(isEn ? "Years of experience" : "Années d’expérience", row.experience),
          digestInfoRow(isEn ? "Languages" : "Langues", row.languages),
          digestInfoRow(isEn ? "Availability" : "Disponibilité", row.availability),
          digestInfoRow(isEn ? "Compatibility score" : "Score de compatibilité", `${row.score}/100`),
          row.eligibilityLabel ? digestInfoRow(isEn ? "Belgium feasibility" : "Faisabilité en Belgique", row.eligibilityLabel) : ""
        ].join(""),
        row.eligibilityLabel
      )
    )
    .join("");

  const body = `
    ${sectionTitle(isEn ? "A new talent matches your search" : "Un nouveau talent correspond à votre recherche")}
    ${matchedOfferTitle ? paragraph(isEn ? `Relevant search or opening: <strong>${escapeHtml(matchedOfferTitle)}</strong>.` : `Recherche ou offre concernée : <strong>${escapeHtml(matchedOfferTitle)}</strong>.`) : ""}
    ${paragraph(intro)}
    ${cards}
    ${ctaButton(isEn ? "View profile" : "Voir le profil", primaryCtaUrl)}
    ${paragraph(`<span style="color:#222222;">${subtitle}</span>`)}
    <div style="margin-top:4px;">
      ${secondaryLink(isEn ? "Check 2026 eligibility" : "Vérifier l’éligibilité 2026", simulatorUrl)}
      ${secondaryLink(isEn ? "Explore LEXPAT legal support" : "Découvrir l’accompagnement LEXPAT", legalSupportUrl)}
    </div>
  `;

  return baseTemplate({
    title: isEn ? "A new talent matches your search on LEXPAT Connect" : "Un nouveau talent correspond à votre recherche sur LEXPAT Connect",
    preheader: isEn ? "A new talent matches your search criteria." : "Un nouveau talent correspond à vos critères de recherche.",
    body,
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail),
    locale,
    preferencesUrl
  });
}

export function newWorkerMatchDigestEmailHtml({
  locale = "fr",
  rows = [],
  profileTitle,
  primaryCtaUrl,
  simulatorUrl,
  legalSupportUrl,
  preferencesUrl,
  recipientEmail
}) {
  const isEn = locale === "en";
  const intro = isEn
    ? "A new opening has just been published on LEXPAT Connect and matches your profile."
    : "Une nouvelle offre vient d’être publiée sur LEXPAT Connect et correspond à votre profil.";
  const subtitle = isEn
    ? "You can contact this employer directly from your secure LEXPAT Connect messaging space."
    : "Vous pouvez contacter cette entreprise directement depuis votre messagerie sécurisée LEXPAT Connect.";

  const cards = rows
    .map((row) =>
      renderDigestCard(
        row.title,
        [
          digestInfoRow(isEn ? "Location" : "Localisation", row.location),
          digestInfoRow(isEn ? "Contract" : "Contrat", row.contractType),
          digestInfoRow(isEn ? "Urgency" : "Urgence", row.urgency),
          digestInfoRow(isEn ? "Sector" : "Secteur", row.sector),
          digestInfoRow(isEn ? "Compatibility score" : "Score de compatibilité", `${row.score}/100`),
          row.eligibilityLabel ? digestInfoRow(isEn ? "Belgium feasibility" : "Faisabilité en Belgique", row.eligibilityLabel) : ""
        ].join(""),
        row.eligibilityLabel
      )
    )
    .join("");

  const body = `
    ${sectionTitle(isEn ? "A new opportunity matches your profile" : "Une nouvelle opportunité correspond à votre profil")}
    ${profileTitle ? paragraph(isEn ? `Profile concerned: <strong>${escapeHtml(profileTitle)}</strong>.` : `Profil concerné : <strong>${escapeHtml(profileTitle)}</strong>.`) : ""}
    ${paragraph(intro)}
    ${cards}
    ${ctaButton(isEn ? "View opportunity" : "Voir l’opportunité", primaryCtaUrl)}
    ${paragraph(`<span style="color:#222222;">${subtitle}</span>`)}
    <div style="margin-top:4px;">
      ${secondaryLink(isEn ? "Check 2026 eligibility" : "Vérifier l’éligibilité 2026", simulatorUrl)}
      ${secondaryLink(isEn ? "Explore LEXPAT legal support" : "Découvrir l’accompagnement LEXPAT", legalSupportUrl)}
    </div>
  `;

  return baseTemplate({
    title: isEn ? "A new opportunity matches your profile on LEXPAT Connect" : "Une nouvelle opportunité correspond à votre profil sur LEXPAT Connect",
    preheader: isEn ? "A new employer opening matches your profile." : "Une nouvelle offre employeur correspond à votre profil.",
    body,
    unsubscribeUrl: getUnsubscribeUrl(recipientEmail),
    locale,
    preferencesUrl
  });
}

/**
 * Email notification — Lead simulateur d'éligibilité
 */
export function eligibilityLeadEmailHtml({ name, email, phone, jobTitle, sector, region, message }) {
  const body = `
    ${sectionTitle("Nouveau lead — Simulateur d'éligibilité")}
    ${paragraph("Un visiteur a utilisé le simulateur et a demandé à être recontacté. Voici ses coordonnées :")}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>
        ${infoRow("Nom", name)}
        ${infoRow("Email", email)}
        ${infoRow("Téléphone", phone)}
        ${infoRow("Poste visé", jobTitle)}
        ${infoRow("Secteur", sector)}
        ${infoRow("Région", region)}
        ${infoRow("Message", message)}
      </tbody>
    </table>

    ${divider()}
    ${paragraph(`<em style="font-size:12px;color:#8ea1bb;">Contactez ce prospect dans les meilleurs délais pour maximiser les chances de conversion.</em>`)}
  `;

  return baseTemplate({
    title: `Nouveau lead simulateur — ${name || email}`,
    preheader: `${name || "Un visiteur"} demande un accompagnement pour un poste de ${jobTitle} en ${region}`,
    body
  });
}
