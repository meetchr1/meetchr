"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { rankPeerMentors } from "@/lib/help/matching";
import { ProductNav } from "@/app/components/ProductNav";

const CATEGORIES = ["classroom", "planning", "parents", "admin", "self"] as const;
const FORMATS = ["async", "micro_session"] as const;

type Category = (typeof CATEGORIES)[number];
type HelpFormat = (typeof FORMATS)[number];

type MatchCandidate = {
  matched_user_id: string;
  rank: number;
  reason_tags: string[];
  mentor_profiles: {
    bio: string | null;
    specialties: string[];
    availability_status: string;
    response_time_estimate: string;
  } | null;
  profiles: {
    display_name: string | null;
    pseudonym: string | null;
    email: string;
  } | null;
};

type PeerMessage = {
  id: string;
  sender_id: string | null;
  content: string;
  metadata: { pinned?: boolean } | null;
  created_at: string;
};

export default function HelpPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("classroom");
  const [format, setFormat] = useState<HelpFormat>("async");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const requested = new URLSearchParams(search).get("category");
    if (requested && CATEGORIES.includes(requested as Category)) {
      setCategory(requested as Category);
    }
  }, []);

  const loadThread = useCallback(
    async (conversation: string) => {
      const { data, error: threadError } = await supabase
        .from("peer_messages")
        .select("id, sender_id, content, metadata, created_at")
        .eq("conversation_id", conversation)
        .order("created_at", { ascending: true });

      if (threadError) {
        setError(threadError.message);
        setMessages([]);
        return;
      }

      setMessages((data ?? []) as PeerMessage[]);
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;
    const boot = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?redirect=/help");
        return;
      }

      setUserId(user.id);
      const { data: latestConversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("provider", "peer")
        .order("last_message_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestConversation?.id) {
        setConversationId(latestConversation.id);
        await loadThread(latestConversation.id);
      }

      if (active) {
        setLoading(false);
      }
    };

    void boot();
    return () => {
      active = false;
    };
  }, [loadThread, router, supabase]);

  const runMatching = async (newRequestId: string, requesterId: string) => {
    const { data: mentors, error: mentorsError } = await supabase
      .from("mentor_profiles")
      .select("user_id, specialties, availability_status, response_time_estimate")
      .eq("availability_status", "available")
      .neq("user_id", requesterId);

    if (mentorsError) {
      setError(mentorsError.message);
      setMatches([]);
      return;
    }

    const top = rankPeerMentors(mentors ?? [], category);

    if (top.length === 0) {
      setMatches([]);
      return;
    }

    const insertRows = top.map((mentor, index) => ({
      help_request_id: newRequestId,
      matched_user_id: mentor.user_id,
      rank: index + 1,
      reason_tags: mentor.reasonTags,
    }));

    const { error: insertMatchError } = await supabase
      .from("peer_matches")
      .insert(insertRows);

    if (insertMatchError) {
      setError(insertMatchError.message);
      setMatches([]);
      return;
    }

    const { data: insertedMatches, error: matchReadError } = await supabase
      .from("peer_matches")
      .select("matched_user_id, rank, reason_tags")
      .eq("help_request_id", newRequestId)
      .order("rank", { ascending: true });

    if (matchReadError) {
      setError(matchReadError.message);
      setMatches([]);
      return;
    }

    const ids = (insertedMatches ?? []).map((item) => item.matched_user_id);
    if (ids.length === 0) {
      setMatches([]);
      return;
    }

    const [{ data: profileRows }, { data: mentorRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name, pseudonym, email")
        .in("id", ids),
      supabase
        .from("mentor_profiles")
        .select("user_id, bio, specialties, availability_status, response_time_estimate")
        .in("user_id", ids),
    ]);

    const profileMap = new Map(
      (profileRows ?? []).map((row) => [row.id, row])
    );
    const mentorMap = new Map(
      (mentorRows ?? []).map((row) => [row.user_id, row])
    );

    const hydrated = (insertedMatches ?? []).map((row) => ({
      matched_user_id: row.matched_user_id,
      rank: row.rank,
      reason_tags: row.reason_tags,
      profiles: profileMap.get(row.matched_user_id) ?? null,
      mentor_profiles: mentorMap.get(row.matched_user_id) ?? null,
    }));

    setMatches(hydrated as MatchCandidate[]);
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    setError(null);

    const { data: request, error: requestError } = await supabase
      .from("help_requests")
      .insert({
        requester_id: userId,
        category,
        format,
        status: "open",
      })
      .select("id")
      .single();

    if (requestError || !request?.id) {
      setError(requestError?.message ?? "Could not create help request");
      setBusy(false);
      return;
    }

    setRequestId(request.id);
    await runMatching(request.id, userId);
    setBusy(false);
  };

  const chooseMatch = async (matchedUserId: string) => {
    if (!userId || !requestId) return;
    setBusy(true);
    setError(null);

    const now = new Date().toISOString();
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        owner_id: userId,
        provider: "peer",
        status: "active",
        last_message_at: now,
      })
      .select("id")
      .single();

    if (conversationError || !conversation?.id) {
      setError(conversationError?.message ?? "Could not open peer chat");
      setBusy(false);
      return;
    }

    const newConversationId = conversation.id;

    const { error: participantError } = await supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: newConversationId, user_id: userId },
        { conversation_id: newConversationId, user_id: matchedUserId },
      ]);

    if (participantError) {
      setError(participantError.message);
      setBusy(false);
      return;
    }

    await supabase.from("peer_messages").insert({
      conversation_id: newConversationId,
      sender_id: null,
      content_type: "template",
      content:
        "Micro-session template: 1) Context (2 min) 2) What I tried (2 min) 3) One next step (3 min) 4) Commitment + check-in date (3 min).",
      metadata: { pinned: true, kind: "micro_session_template" },
    });

    await supabase
      .from("help_requests")
      .update({ status: "matched" })
      .eq("id", requestId);

    setConversationId(newConversationId);
    await loadThread(newConversationId);
    setBusy(false);
  };

  const sendPeerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !draft.trim() || !userId) return;

    const text = draft.trim();
    setDraft("");
    setBusy(true);
    setError(null);

    const { error: sendError } = await supabase.from("peer_messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content_type: "text",
      content: text,
      metadata: {},
    });

    if (sendError) {
      setError(sendError.message);
      setBusy(false);
      return;
    }

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    await loadThread(conversationId);
    setBusy(false);
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
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Peer Help Network</h1>
          <p className="text-sm text-gray-600">
            Get matched with peers by specialty and availability.
          </p>
          <ProductNav current="/help" />
        </div>

        {!conversationId && (
          <>
            <form
              onSubmit={submitRequest}
              className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
            >
              <h2 className="text-sm font-semibold text-gray-900">Request help</h2>
              <div>
                <label
                  htmlFor="help-category"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="help-category"
                  name="help-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-1">Format</p>
                <div className="flex gap-3">
                  {FORMATS.map((item) => (
                    <label key={item} className="text-sm text-gray-700 inline-flex items-center gap-2">
                      <input
                        type="radio"
                        checked={format === item}
                        onChange={() => setFormat(item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
              >
                {busy ? "Finding matches..." : "Find peers"}
              </button>
            </form>

            {matches.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-semibold text-gray-900">Top matches</h2>
                {matches.map((match) => (
                  <div
                    key={match.matched_user_id}
                    className="border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        #{match.rank}{" "}
                        {match.profiles?.display_name ||
                          match.profiles?.pseudonym ||
                          match.profiles?.email ||
                          "Peer Coach"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {(match.mentor_profiles?.specialties ?? []).join(", ") ||
                          "No specialties listed"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        tags: {match.reason_tags.join(", ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => chooseMatch(match.matched_user_id)}
                      disabled={busy}
                      className="px-3 py-2 text-xs rounded-lg border border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-50"
                    >
                      Choose
                    </button>
                  </div>
                ))}
              </section>
            )}
          </>
        )}

        {conversationId && (
          <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Peer chat</h2>
            <div className="h-[52vh] overflow-y-auto space-y-2">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">No messages yet.</p>
              ) : (
                messages.map((msg) => {
                  const mine = msg.sender_id === userId;
                  const pinned = Boolean(msg.metadata?.pinned);
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[88%] rounded-lg px-3 py-2 text-sm ${
                        pinned
                          ? "bg-amber-50 border border-amber-200 text-amber-900"
                          : mine
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
            <form onSubmit={sendPeerMessage} className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Send a message to your peer coach..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </section>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
