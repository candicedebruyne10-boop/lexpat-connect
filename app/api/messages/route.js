import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

/**
 * GET /api/messages?conversation_id=xxx
 * Retourne les messages d'une conversation + marque les messages reçus comme lus.
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const conversation_id = searchParams.get("conversation_id");

    if (!conversation_id) {
      return NextResponse.json({ error: "conversation_id requis." }, { status: 400 });
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_type, sender_id, content, read, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Déterminer le sender_type de l'utilisateur courant pour marquer comme lu
    const [{ data: membership }, { data: workerProfile }] = await Promise.all([
      supabase.from("employer_members").select("employer_profile_id").eq("user_id", user.id).maybeSingle(),
      supabase.from("worker_profiles").select("id").eq("user_id", user.id).maybeSingle(),
    ]);
    const myType = membership ? "employer" : workerProfile ? "worker" : null;

    // Marquer comme lus les messages de l'autre partie
    if (myType && messages?.length) {
      const unreadIds = messages
        .filter((m) => m.sender_type !== myType && !m.read)
        .map((m) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ read: true }).in("id", unreadIds);
      }
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

/**
 * POST /api/messages
 * Envoie un message dans une conversation.
 * Body: { conversation_id, content }
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { conversation_id, content } = await request.json();

    if (!conversation_id || !content?.trim()) {
      return NextResponse.json({ error: "conversation_id et content requis." }, { status: 400 });
    }

    // Vérifier l'appartenance à la conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("id, employer_id, worker_id, status")
      .eq("id", conversation_id)
      .maybeSingle();

    if (!conv) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });

    // Identifier le rôle de l'expéditeur
    const [{ data: membership }, { data: workerProfile }] = await Promise.all([
      supabase.from("employer_members").select("employer_profile_id").eq("user_id", user.id).maybeSingle(),
      supabase.from("worker_profiles").select("id").eq("user_id", user.id).maybeSingle(),
    ]);

    let sender_type, sender_id;
    if (membership && membership.employer_profile_id === conv.employer_id) {
      sender_type = "employer";
      sender_id = membership.employer_profile_id;
    } else if (workerProfile && workerProfile.id === conv.worker_id) {
      sender_type = "worker";
      sender_id = workerProfile.id;
    } else {
      return NextResponse.json({ error: "Accès refusé à cette conversation." }, { status: 403 });
    }

    // Insérer le message
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({ conversation_id, sender_type, sender_id, content: content.trim(), read: false })
      .select("id, conversation_id, sender_type, sender_id, content, read, created_at")
      .single();

    if (msgError) return NextResponse.json({ error: msgError.message }, { status: 500 });

    // Mettre à jour le statut de la conversation
    let newStatus = conv.status;
    if (conv.status === "match_confirmed") newStatus = "first_message_sent";
    else if (conv.status === "first_message_sent") newStatus = "discussion_active";

    if (newStatus !== conv.status) {
      await supabase
        .from("conversations")
        .update({ status: newStatus })
        .eq("id", conversation_id);
    }

    return NextResponse.json({ message });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
