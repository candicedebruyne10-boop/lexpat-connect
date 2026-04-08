import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "../../../lib/supabase/server";

function required(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function feedbackEmailHtml(payload) {
  const rows = [
    ["Testeur", payload.tester_name],
    ["Page", payload.page_label],
    ["Type", payload.feedback_type],
    ["Priorité", payload.priority],
    ["Appareil", payload.device],
    ["Navigateur", payload.browser],
    ["Résumé", payload.summary],
    ["Observation", payload.details],
    ["Attendu", payload.expected_result],
    ["Suggestion", payload.suggested_fix]
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5edf4;font-weight:600;width:220px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5edf4;">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17345d;">
      <h2 style="margin-bottom:8px;">Nouveau retour testeur — LEXPAT Connect</h2>
      <p style="margin-top:0;color:#5d6e83;">Retour enregistré depuis l'outil de test du site.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:24px;">
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const payload = {
      tester_name: body.tester_name?.trim() || "Visiteur",
      page_label: body.page_label?.trim() || "",
      feedback_type: body.feedback_type?.trim() || "Suggestion",
      priority: body.priority?.trim() || "À améliorer",
      device: body.device?.trim() || "",
      browser: body.browser?.trim() || "",
      summary: body.summary?.trim() || body.details?.trim().slice(0, 120) || "",
      details: body.details?.trim() || "",
      expected_result: body.expected_result?.trim() || "",
      suggested_fix: body.suggested_fix?.trim() || ""
    };

    if (!required(payload.page_label) || !required(payload.feedback_type) || !required(payload.priority) || !required(payload.summary) || !required(payload.details)) {
      return NextResponse.json(
        { error: "Merci de compléter au minimum la page concernée et votre retour." },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    const { error: insertError } = await supabase.from("test_feedback").insert(payload);

    if (insertError) {
      throw new Error(insertError.message);
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL || "contact@lexpat-connect.be";
    const from = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from,
        to: recipient,
        subject: `[LEXPAT Connect] Retour testeur — ${payload.tester_name} — ${payload.page_label}`,
        html: feedbackEmailHtml(payload)
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Impossible d'enregistrer le retour testeur." },
      { status: 500 }
    );
  }
}
