import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRows(fields) {
  return fields
    .filter((field) => field.value)
    .map((field) => {
      const label = escapeHtml(field.label);
      const value = escapeHtml(field.value).replaceAll("\n", "<br />");

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5edf4; font-weight: 600; width: 220px; vertical-align: top;">${label}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5edf4;">${value}</td>
        </tr>
      `;
    })
    .join("");
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "";
  }

  return realIp || "";
}

export async function POST(request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL || "contact@lexpat-connect.be";
    const from = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Configuration email incomplète. Ajoutez RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const formType = body.formType || "contact";
    const title = body.title || "Nouvelle demande";
    const fields = Array.isArray(body.fields) ? body.fields : [];
    const replyToField = fields.find((field) => ["Email", "Email professionnel"].includes(field.label));
    const rows = buildRows(fields);
    const submittedAt = new Date().toISOString();
    const requestDetails = buildRows([
      { label: "Date de soumission", value: submittedAt },
      { label: "Adresse IP publique", value: getClientIp(request) },
      { label: "User-Agent", value: request.headers.get("user-agent") || "" },
      { label: "Referer", value: request.headers.get("referer") || "" },
      { label: "Langue du navigateur", value: request.headers.get("accept-language") || "" }
    ]);

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17345d;">
        <h2 style="margin-bottom: 8px;">${escapeHtml(title)}</h2>
        <p style="margin-top: 0; color: #5d6e83;">Type de formulaire : ${escapeHtml(formType)}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <tbody>${rows}</tbody>
        </table>
        <h3 style="margin: 28px 0 8px; font-size: 16px;">Metadonnees techniques</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>${requestDetails}</tbody>
        </table>
      </div>
    `;

    const resend = new Resend(resendApiKey);
    let emailSent = false;
    let emailErrorMessage = "";

    try {
      const { error: primaryEmailError } = await resend.emails.send({
        from,
        to: recipient,
        subject: `[LEXPAT Connect] ${title}`,
        replyTo: replyToField?.value,
        html
      });

      if (primaryEmailError) {
        emailErrorMessage = primaryEmailError.message || "Erreur Resend inconnue";
        console.error("[forms] Erreur Resend :", primaryEmailError);
      } else {
        emailSent = true;
        console.log(`[forms] Email envoyé à ${recipient}`);

        if (replyToField?.value) {
          const { error: confirmationEmailError } = await resend.emails.send({
            from,
            to: replyToField.value,
            subject: "Votre demande a bien été enregistrée — LEXPAT Connect",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #17345d;">
                <h2 style="margin-bottom: 12px;">Votre demande a bien été enregistrée</h2>
                <p>Merci pour votre message. Votre demande a bien été transmise à LEXPAT Connect.</p>
                <p>Nous reviendrons vers vous dès qu'une première lecture de votre besoin aura pu être effectuée.</p>
                <p style="margin-top: 20px; color: #5d6e83;">Selon la nature de votre demande, elle pourra être traitée par la plateforme LEXPAT Connect ou, si nécessaire, orientée vers le cabinet LEXPAT.</p>
              </div>
            `
          });

          if (confirmationEmailError) {
            console.error("[forms] Erreur email de confirmation :", confirmationEmailError);
          }
        }
      }
    } catch (emailError) {
      emailErrorMessage = emailError.message || "Impossible d'envoyer l'email";
      console.error("[forms] Impossible d'envoyer l'email :", emailError.message);
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      emailError: emailErrorMessage
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi du formulaire." },
      { status: 500 }
    );
  }
}
