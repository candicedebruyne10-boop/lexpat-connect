import { verifyUnsubscribeToken, addUnsubscribe } from "../../../lib/email-unsubscribe";

/**
 * GET /api/unsubscribe?email=...&token=...
 *
 * Endpoint de désinscription RGPD.
 * Vérifie le token HMAC, ajoute l'email en base, retourne une page HTML de confirmation.
 * Aucune authentification requise — le token signé sert de preuve d'identité.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

  if (!email || !token) {
    return htmlResponse(errorPage("Lien invalide", "Ce lien de désinscription est incomplet ou malformé.", siteUrl));
  }

  let valid = false;
  try {
    valid = verifyUnsubscribeToken(email, token);
  } catch {
    valid = false;
  }

  if (!valid) {
    return htmlResponse(errorPage("Lien invalide", "Ce lien de désinscription n'est pas valide. Il a peut-être déjà été utilisé ou a été modifié.", siteUrl));
  }

  try {
    await addUnsubscribe(email);
    return htmlResponse(successPage(email, siteUrl));
  } catch (err) {
    console.error("[unsubscribe] Erreur :", err.message);
    return htmlResponse(errorPage("Erreur temporaire", "Une erreur est survenue. Veuillez réessayer dans quelques instants ou écrire à contact@lexpat-connect.be.", siteUrl));
  }
}

// ─── Pages HTML inline ──────────────────────────────────────────────────────

function htmlResponse(html) {
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

function shell({ title, icon, heading, body, siteUrl }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — LEXPAT Connect</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif; }
    .wrap { max-width: 520px; margin: 80px auto; padding: 0 24px; text-align: center; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(30,58,120,.08); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #1E3A78; margin: 0 0 12px; }
    p { font-size: 14px; color: #5d6e83; line-height: 1.7; margin: 0 0 24px; }
    a.btn { display: inline-block; background: linear-gradient(135deg,#1E3A78 0%,#204E97 100%); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 700; }
    .logo { margin-top: 32px; font-size: 13px; color: #8ea1bb; }
    .logo strong { color: #1E3A78; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="icon">${icon}</div>
      <h1>${heading}</h1>
      ${body}
      <a class="btn" href="${siteUrl}">Retourner sur LEXPAT Connect</a>
    </div>
    <div class="logo"><strong>LEXPAT</strong> <span style="letter-spacing:3px;color:#57B7AF;">CONNECT</span></div>
  </div>
</body>
</html>`;
}

function successPage(email, siteUrl) {
  return shell({
    title: "Désinscription confirmée",
    icon: "✅",
    heading: "Désinscription confirmée",
    body: `
      <p>L'adresse <strong>${escHtml(email)}</strong> ne recevra plus de notifications de la plateforme LEXPAT Connect.</p>
      <p style="font-size:12px;color:#8ea1bb;">
        Pour supprimer définitivement votre compte et l'ensemble de vos données personnelles,
        écrivez-nous à <a href="mailto:contact@lexpat-connect.be" style="color:#57B7AF;">contact@lexpat-connect.be</a>
        en mentionnant votre demande de suppression — conformément au RGPD, nous traiterons votre demande sous 30 jours.
      </p>
    `,
    siteUrl
  });
}

function errorPage(heading, message, siteUrl) {
  return shell({
    title: "Erreur de désinscription",
    icon: "⚠️",
    heading,
    body: `<p>${escHtml(message)}</p>`,
    siteUrl
  });
}

function escHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
