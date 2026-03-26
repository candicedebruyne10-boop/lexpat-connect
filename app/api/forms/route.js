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

export async function POST(request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL;
    const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!resendApiKey || !recipient) {
      return NextResponse.json(
        { error: "Configuration email incomplète. Ajoutez RESEND_API_KEY et CONTACT_EMAIL." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const formType = body.formType || "contact";
    const title = body.title || "Nouvelle demande";
    const fields = Array.isArray(body.fields) ? body.fields : [];
    const replyToField = fields.find((field) => ["Email", "Email professionnel"].includes(field.label));

    const rows = fields
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

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17345d;">
        <h2 style="margin-bottom: 8px;">${escapeHtml(title)}</h2>
        <p style="margin-top: 0; color: #5d6e83;">Type de formulaire : ${escapeHtml(formType)}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from,
      to: recipient,
      subject: `[LEXPAT Connect] ${title}`,
      replyTo: replyToField?.value,
      html
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi du formulaire." },
      { status: 500 }
    );
  }
}
