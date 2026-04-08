import { NextResponse } from "next/server";

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[eligibility-lead] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
