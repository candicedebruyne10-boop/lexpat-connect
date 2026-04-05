import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

/**
 * GET /api/conversations
 * Retourne toutes les conversations de l'utilisateur connecté.
 * Inclut : dernier message, nombre de non-lus, infos match, employer, worker.
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    // Trouver employer_profile_id et worker_profile_id de l'utilisateur
    const [{ data: membership }, { data: workerProfile }] = await Promise.all([
      supabase
        .from("employer_members")
        .select("employer_profile_id, full_name")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("worker_profiles")
        .select("id, full_name, target_job")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    // Construire la condition OR selon le rôle
    let query = supabase
      .from("conversations")
      .select(`
        id, match_id, employer_id, worker_id, status, created_at, updated_at,
        employer_profiles!employer_id ( id, company_name ),
        worker_profiles!worker_id ( id, full_name, target_job ),
        matches!match_id ( id, score, job_offer_id,
          job_offers!job_offer_id ( title, sector, region )
        ),
        conversation_actions ( legal_review_needed, interview_requested, archived )
      `)
      .order("updated_at", { ascending: false });

    if (membership && workerProfile) {
      query = query.or(
        `employer_id.eq.${membership.employer_profile_id},worker_id.eq.${workerProfile.id}`
      );
    } else if (membership) {
      query = query.eq("employer_id", membership.employer_profile_id);
    } else if (workerProfile) {
      query = query.eq("worker_id", workerProfile.id);
    } else {
      return NextResponse.json({ conversations: [] });
    }

    const { data: conversations, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!conversations?.length) return NextResponse.json({ conversations: [] });

    // Pour chaque conversation : dernier message + nombre de non-lus
    const convIds = conversations.map((c) => c.id);

    const { data: lastMessages } = await supabase
      .from("messages")
      .select("conversation_id, content, created_at, sender_type, read")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false });

    // Grouper par conversation_id
    const lastMsgMap = {};
    const unreadMap = {};
    (lastMessages || []).forEach((msg) => {
      if (!lastMsgMap[msg.conversation_id]) {
        lastMsgMap[msg.conversation_id] = msg;
      }
      // Compter non-lus (messages de l'autre partie non lus)
      if (!msg.read) {
        const conv = conversations.find((c) => c.id === msg.conversation_id);
        const isMine =
          (membership && msg.sender_type === "employer") ||
          (workerProfile && msg.sender_type === "worker");
        if (!isMine) {
          unreadMap[msg.conversation_id] = (unreadMap[msg.conversation_id] || 0) + 1;
        }
      }
    });

    const result = conversations.map((conv) => {
      const lastMsg = lastMsgMap[conv.id];
      const actions = conv.conversation_actions?.[0] || {
        legal_review_needed: false,
        interview_requested: false,
        archived: false,
      };
      return {
        id: conv.id,
        match_id: conv.match_id,
        status: conv.status,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        employer: {
          id: conv.employer_id,
          name: conv.employer_profiles?.company_name || "Entreprise",
          initials: (conv.employer_profiles?.company_name || "EP")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        },
        worker: {
          id: conv.worker_id,
          name: conv.worker_profiles?.full_name || "Candidat",
          initials: (conv.worker_profiles?.full_name || "CA")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        },
        job_title: conv.matches?.job_offers?.title || "Poste",
        region: conv.matches?.job_offers?.region || "",
        compatibility_score: conv.matches?.score || 0,
        last_message: lastMsg?.content || "",
        last_message_at: lastMsg?.created_at || conv.created_at,
        last_sender: lastMsg?.sender_type || null,
        unread: unreadMap[conv.id] || 0,
        actions,
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

/**
 * POST /api/conversations
 * Crée une conversation à partir d'un match (status=contacted).
 * Idempotent : si elle existe déjà (match_id unique), retourne l'existante.
 * Body: { match_id }
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { match_id } = await request.json();

    if (!match_id) {
      return NextResponse.json({ error: "match_id requis." }, { status: 400 });
    }

    // Vérifier que le match existe et appartient à l'utilisateur
    const { data: match } = await supabase
      .from("matches")
      .select(`
        id, status, score, job_offer_id, worker_profile_id,
        job_offers!job_offer_id ( employer_profile_id )
      `)
      .eq("id", match_id)
      .maybeSingle();

    if (!match) {
      return NextResponse.json({ error: "Match introuvable." }, { status: 404 });
    }

    const employer_id = match.job_offers?.employer_profile_id;
    const worker_id = match.worker_profile_id;

    if (!employer_id || !worker_id) {
      return NextResponse.json({ error: "Données de match incomplètes." }, { status: 400 });
    }

    // Upsert conversation (idempotent sur match_id)
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .upsert(
        { match_id, employer_id, worker_id, status: "match_confirmed" },
        { onConflict: "match_id", ignoreDuplicates: false }
      )
      .select("id, match_id, employer_id, worker_id, status")
      .single();

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    // Créer les conversation_actions si elles n'existent pas
    await supabase
      .from("conversation_actions")
      .upsert(
        { conversation_id: conv.id },
        { onConflict: "conversation_id", ignoreDuplicates: true }
      );

    return NextResponse.json({ conversation: conv });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

/**
 * PATCH /api/conversations
 * Met à jour le statut d'une conversation ou ses actions.
 * Body: { conversation_id, status?, actions? }
 */
export async function PATCH(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { conversation_id, status, actions } = await request.json();

    if (!conversation_id) {
      return NextResponse.json({ error: "conversation_id requis." }, { status: 400 });
    }

    const updates = {};
    if (status) updates.status = status;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from("conversations")
        .update(updates)
        .eq("id", conversation_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (actions) {
      const { error } = await supabase
        .from("conversation_actions")
        .update({ ...actions, updated_at: new Date().toISOString() })
        .eq("conversation_id", conversation_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
