import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getNotificationRecipient, getSenderAddress } from "../../../lib/email-routing";
import { eligibilityLeadEmailHtml } from "../../../lib/email-templates";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, company, phone, result, formData } = body;

    const payload = {
      email,
      company:    company || "",
      phone:      phone   || "",
      profession: formData?.profession || "",
      region:     formData?.region     || "",
      verdict:    result?.verdict      || "",
      score:      result?.score        || 0,
      timestamp:  new Date().toISOString(),
    };

    console.log("[eligibility-lead]", payload);

    // Webhook Make / Zapier (optionnel)
    const webhookUrl = process.env.ELIGIBILITY_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    // Email de notification LEXPAT (best-effort)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: getSenderAddress(),
        to: getNotificationRecipient(),
        subject: `[LEXPAT Connect] Nouveau lead simulateur — ${email}`,
        html: eligibilityLeadEmailHtml({
          name: company || null,
          email,
          phone,
          jobTitle: payload.profession,
          sector: null,
          region: payload.region,
          message: payload.verdict ? `Résultat du simulateur : ${payload.verdict}` : null
        })
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[eligibility-lead] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
