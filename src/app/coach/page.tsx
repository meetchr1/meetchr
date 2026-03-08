"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductNav } from "@/app/components/ProductNav";

type CoachMessage = {
  id: string;
  sender_id: string | null;
  content: string;
  metadata: {
    suggested_action?: string;
  } | null;
  created_at: string;
};

export default function CoachPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [suggestedAction, setSuggestedAction] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);

  const loadConversation = useCallback(async () => {
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login?redirect=/coach");
      return;
    }

    const { data: latest } = await supabase
      .from("conversations")
      .select("id, coach_summary")
      .eq("owner_id", user.id)
      .eq("provider", "ai")
      .order("last_message_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latest?.id) {
      setConversationId(null);
      setMessages([]);
      setSuggestedAction(null);
      setCrisis(false);
      return;
    }

    setConversationId(latest.id);
    const summary = latest.coach_summary as
      | { suggested_action?: string; crisis_flag?: boolean }
      | null;
    setSuggestedAction(summary?.suggested_action ?? null);
    setCrisis(Boolean(summary?.crisis_flag));

    const { data: thread, error: threadError } = await supabase
      .from("coach_messages")
      .select("id, sender_id, content, metadata, created_at")
      .eq("conversation_id", latest.id)
      .order("created_at", { ascending: true });

    if (threadError) {
      setError(threadError.message);
      setMessages([]);
      return;
    }
    setMessages((thread ?? []) as CoachMessage[]);
  }, [router, supabase]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await loadConversation();
      if (active) {
        setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [loadConversation]);

  const startConversation = async () => {
    setSending(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login?redirect=/coach");
      return;
    }

    const { data, error: createError } = await supabase
      .from("conversations")
      .insert({
        owner_id: user.id,
        provider: "ai",
        status: "active",
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !data) {
      setError(createError?.message ?? "Could not start conversation");
      setSending(false);
      return;
    }

    setConversationId(data.id);
    setMessages([]);
    setSending(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setSending(true);
    setError(null);
    const message = draft.trim();
    setDraft("");

    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, message }),
      });

      const json = (await response.json()) as {
        error?: string;
        conversationId?: string;
        reply?: string;
        meta?: { suggested_action?: string };
        crisis?: boolean;
      };

      if (!response.ok) {
        setError(json.error ?? "Failed to send message");
        setSending(false);
        return;
      }

      setConversationId(json.conversationId ?? conversationId);
      setSuggestedAction(json.meta?.suggested_action ?? null);
      setCrisis(Boolean(json.crisis));
      await loadConversation();
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">AI Coach</h1>
          <p className="text-sm text-gray-600">
            Private, supportive coaching for tough teaching moments.
          </p>
          <ProductNav current="/coach" />
        </div>

        {!conversationId ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-700 mb-4">
              Start a private coaching conversation.
            </p>
            <button
              type="button"
              onClick={startConversation}
              disabled={sending}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
            >
              {sending ? "Starting..." : "Start conversation"}
            </button>
          </div>
        ) : (
          <>
            {suggestedAction && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-blue-900">
                  Suggested action
                </h2>
                <p className="text-sm text-blue-800 mt-1">{suggestedAction}</p>
              </div>
            )}

            {crisis && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-red-900">
                      Immediate support resources
                    </h2>
                    <p className="text-sm text-red-800 mt-1">
                      If you may harm yourself, call local emergency services now.
                      In the U.S., call or text 988 for the Suicide &amp; Crisis
                      Lifeline.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-4 h-[50vh] overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Ask what is feeling heavy today.
                </p>
              ) : (
                messages.map((msg) => {
                  const fromUser = Boolean(msg.sender_id);
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        fromUser
                          ? "ml-auto bg-pink-600 text-white"
                          : "mr-auto bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
