import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  fetchClaudeCoachReply,
  hasSelfHarmKeywords,
  type CoachReply,
} from "@/lib/ai/coach";

type ReplyRequest = {
  conversationId?: string;
  message?: string;
};

async function getOrCreateConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  conversationId?: string
) {
  if (conversationId) {
    const { data: conversation, error } = await supabase
      .from("conversations")
      .select("id, owner_id")
      .eq("id", conversationId)
      .single();

    if (error || !conversation || conversation.owner_id !== userId) {
      return { error: "Conversation not found", conversationId: null };
    }

    return { error: null, conversationId: conversation.id };
  }

  const { data: created, error: createError } = await supabase
    .from("conversations")
    .insert({
      owner_id: userId,
      provider: "ai",
      status: "active",
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (createError || !created) {
    return { error: "Unable to create conversation", conversationId: null };
  }

  return { error: null, conversationId: created.id };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ReplyRequest;
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convResult = await getOrCreateConversation(
    supabase,
    user.id,
    body.conversationId
  );

  if (convResult.error || !convResult.conversationId) {
    return NextResponse.json({ error: convResult.error }, { status: 404 });
  }

  const conversationId = convResult.conversationId;
  const now = new Date().toISOString();

  await supabase.from("coach_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content_type: "text",
    content: message,
    metadata: { role: "user" },
  });

  let parsed: CoachReply;
  try {
    parsed = await fetchClaudeCoachReply(message);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate coach response" },
      { status: 502 }
    );
  }

  const keywordCrisis = hasSelfHarmKeywords(message);
  const crisis = parsed.meta.crisis_flag || keywordCrisis;

  await supabase.from("coach_messages").insert({
    conversation_id: conversationId,
    sender_id: null,
    content_type: "text",
    content: parsed.text,
    metadata: parsed.meta,
  });

  await supabase
    .from("conversations")
    .update({
      last_message_at: now,
      coach_summary: {
        tone: parsed.meta.tone,
        suggested_action: parsed.meta.suggested_action,
        escalate: parsed.meta.escalate,
        crisis_flag: crisis,
      },
    })
    .eq("id", conversationId);

  return NextResponse.json({
    conversationId,
    reply: parsed.text,
    meta: parsed.meta,
    crisis,
  });
}
