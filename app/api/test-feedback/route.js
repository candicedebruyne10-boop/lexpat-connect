import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "../../../lib/supabase/server";
import { getNotificationRecipient, getSenderAddress } from "../../../lib/email-routing";
import { testFeedbackEmailHtml } from "../../../lib/email-templates";

function required(value) {
  return typeof value === "string" && value.trim().length > 0;
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
    const recipient = getNotificationRecipient();
    const from = getSenderAddress();
    let emailSent = false;
    let emailErrorMessage = "";

    if (!resendApiKey) {
      emailErrorMessage = "RESEND_API_KEY manquant";
      console.warn("[test-feedback] RESEND_API_KEY manquant — email non envoyé. Retour enregistré en base uniquement.");
    } else {
      try {
        const resend = new Resend(resendApiKey);
        const { error: emailError } = await resend.emails.send({
          from,
          to: recipient,
          subject: `[LEXPAT Connect] Retour testeur — ${payload.tester_name} — ${payload.page_label}`,
          html: testFeedbackEmailHtml({
            testerName: payload.tester_name,
            pageLabel: payload.page_label,
            feedbackType: payload.feedback_type,
            priority: payload.priority,
            device: payload.device,
            browser: payload.browser,
            summary: payload.summary,
            details: payload.details,
            expectedResult: payload.expected_result,
            suggestedFix: payload.suggested_fix
          })
        });
        if (emailError) {
          emailErrorMessage = emailError.message || "Erreur Resend inconnue";
          console.error("[test-feedback] Erreur Resend :", emailError);
        } else {
          emailSent = true;
          console.log(`[test-feedback] Email envoyé à ${recipient}`);
        }
      } catch (emailErr) {
        emailErrorMessage = emailErr.message || "Impossible d'envoyer l'email";
        console.error("[test-feedback] Impossible d'envoyer l'email :", emailErr.message);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      emailError: emailErrorMessage
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Impossible d'enregistrer le retour testeur." },
      { status: 500 }
    );
  }
}
