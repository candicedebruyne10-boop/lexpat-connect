import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";

const BUCKET   = "worker-documents";
const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED  = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * POST /api/messages/upload
 * Accepts multipart/form-data with:
 *   - "file"            : the file to upload
 *   - "conversationId"  : conversation context (used to organise storage path)
 *
 * Returns: { ok: true, url, name, size, type }
 */
export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const formData = await request.formData();
    const file           = formData.get("file");
    const conversationId = formData.get("conversationId") || "general";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non accepté. Utilisez PDF, Word, Excel ou image (JPG/PNG/WEBP)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Le fichier ne peut pas dépasser 10 Mo." },
        { status: 400 }
      );
    }

    // Path : workers/{userId}/messages/{conversationId}/{timestamp}_{filename}
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path     = `workers/${user.id}/messages/${conversationId}/${Date.now()}_${safeName}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const supabase = getServiceClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    // URL signée valable 10 ans (le document reste accessible dans la conversation)
    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);

    if (signError) throw new Error(signError.message);

    return NextResponse.json({
      ok:   true,
      url:  signed.signedUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("[messages/upload]", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur lors du téléversement." },
      { status: 500 }
    );
  }
}
