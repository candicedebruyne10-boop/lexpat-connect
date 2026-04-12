import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const BUCKET = "worker-documents";

/**
 * POST /api/cv-upload
 * Accepts multipart/form-data with a "file" field.
 * Uploads the CV to Supabase Storage, saves the URL to worker_profiles.cv_url.
 *
 * Requires (one-time manual setup in Supabase):
 *   1. Create a Storage bucket named "cv-files" (private, no public access needed)
 *   2. The service key used here bypasses RLS — no additional policy required
 *   3. Run SQL: ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;
 */
export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const formData = await request.formData();
    const file = formData.get("file");

    // ── Validate ─────────────────────────────────────────────────────────────
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Seuls les fichiers PDF, DOC et DOCX sont acceptés." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Le fichier ne peut pas dépasser 5 Mo." },
        { status: 400 }
      );
    }

    // ── Upload to Supabase Storage ────────────────────────────────────────────
    const ext    = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path   = `${user.id}/cv.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getServiceClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // ── Build a signed URL (valid 10 years) ───────────────────────────────────
    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

    if (signedError) throw new Error(signedError.message);
    const url = signedData.signedUrl;

    // ── Save URL on the worker profile ────────────────────────────────────────
    await supabase
      .from("worker_profiles")
      .update({ cv_url: url })
      .eq("user_id", user.id);

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[cv-upload]", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur lors du téléversement." },
      { status: 500 }
    );
  }
}
