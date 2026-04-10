import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getNotificationRecipient, getSenderAddress } from "../../../lib/email-routing";
import { contactFormEmailHtml } from "../../../lib/email-templates";

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
    const recipient = getNotificationRecipient();
    const from = getSenderAddress();

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

    // Enrichir avec les métadonnées techniques
    const enrichedFields = [
      ...fields,
      { label: "Date de soumission", value: new Date().toISOString() },
      { label: "Adresse IP", value: getClientIp(request) },
      { label: "Referer", value: request.headers.get("referer") || "" }
    ];

    const html = contactFormEmailHtml({
      formTitle: title,
      formType,
      fields: enrichedFields
    });

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
