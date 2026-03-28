"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductNav } from "@/app/components/ProductNav";
import {
  buildHelpRequestUrl,
  toHelpCategory,
  type HelpCategory,
} from "@/lib/portal/quickAction";

const HEAVINESS_OPTIONS = ["light", "manageable", "heavy", "not_ok"] as const;
const HELP_OPTIONS = ["classroom", "planning", "parents", "admin", "self"] as const;

type Heaviness = (typeof HEAVINESS_OPTIONS)[number];

type CheckinRow = {
  id: string;
  date: string;
  heaviness: Heaviness;
  theme: HelpCategory;
  note: string | null;
};

export default function PortalPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("Teacher");
  const [heaviness, setHeaviness] = useState<Heaviness | null>(null);
  const [theme, setTheme] = useState<HelpCategory>("classroom");
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [helpCategory, setHelpCategory] = useState<HelpCategory>("classroom");
  const [waitingForMatch, setWaitingForMatch] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const loadPortal = useCallback(async () => {
    setError(null);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login?redirect=/portal");
      return;
    }

    setUserId(user.id);

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? "",
        display_name:
          (user.user_metadata?.display_name as string | undefined) ??
          (user.user_metadata?.full_name as string | undefined) ??
          user.email?.split("@")[0] ??
          "Teacher",
      },
      { onConflict: "id" }
    );

    if (profileError) {
      setError(profileError.message);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, pseudonym")
      .eq("id", user.id)
      .single();
    setName(profile?.display_name || profile?.pseudonym || "Teacher");

    const { data: recent, error: checkinsError } = await supabase
      .from("checkins")
      .select("id, date, heaviness, theme, note")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(7);

    if (checkinsError) {
      setError(checkinsError.message);
      setCheckins([]);
      return;
    }

    const rows = (recent ?? []) as CheckinRow[];
    setCheckins(rows);
    const todayRow = rows.find((row) => row.date === today);
    setHeaviness(todayRow?.heaviness ?? null);
    setTheme(toHelpCategory(todayRow?.theme ?? "classroom"));
  }, [router, supabase, today]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await loadPortal();
      if (active) {
        setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [loadPortal]);

  const saveCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !heaviness) {
      return;
    }

    setSaving(true);
    setError(null);
    const { error: upsertError } = await supabase.from("checkins").upsert(
      {
        user_id: userId,
        date: today,
        heaviness,
        theme,
        note: null,
      },
      { onConflict: "user_id,date" }
    );

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    await loadPortal();
    setSaving(false);
  };

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/auth/signout", { method: "POST" });
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
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
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Check in quickly, then route to the right support.
          </p>
          <ProductNav current="/portal" />
        </div>

        {waitingForMatch && (
          <div
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            <p className="font-medium text-amber-900">
              We&apos;re still pairing you with another teacher for mentorship.
            </p>
            <p className="mt-1 text-amber-800/90">
              You can use everything here while we find a good match—check-ins,
              help requests, and the rest of the app stay open.
            </p>
          </div>
        )}

        <p className="text-gray-600">Hi {name}, how is today feeling?</p>

        <form
          onSubmit={saveCheckin}
          className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
        >
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Daily heaviness check-in
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HEAVINESS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setHeaviness(option)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    heaviness === option
                      ? "border-pink-600 bg-pink-50 text-pink-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label
              htmlFor="checkin-theme"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Theme
            </label>
            <select
              id="checkin-theme"
              value={theme}
              onChange={(e) => setTheme(toHelpCategory(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {HELP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          <button
            type="submit"
            disabled={saving || !heaviness}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save check-in"}
          </button>
        </form>

        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            I need help with...
          </h2>
          <div className="flex flex-wrap gap-2">
            {HELP_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHelpCategory(option)}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  helpCategory === option
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <Link
            href={buildHelpRequestUrl(helpCategory)}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-blue-300 text-blue-700 text-sm hover:bg-blue-50"
          >
            Open help request
          </Link>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Mentorship tools
          </h2>
          <p className="text-sm text-gray-600">
            Access the matching survey and live mentorship workspace.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link
              href="/survey"
              className="px-3 py-2 rounded-lg border border-violet-300 text-violet-700 text-sm hover:bg-violet-50"
            >
              Open matching survey
            </Link>
            <Link
              href="/hub?tab=chat"
              className="px-3 py-2 rounded-lg border border-emerald-300 text-emerald-700 text-sm hover:bg-emerald-50"
            >
              Open live chat
            </Link>
            <Link
              href="/hub?tab=workspace"
              className="px-3 py-2 rounded-lg border border-cyan-300 text-cyan-700 text-sm hover:bg-cyan-50"
            >
              Start video session
            </Link>
          </div>
          <Link
            href="/hub/classic"
            className="inline-flex items-center px-3 py-2 rounded-lg border border-pink-300 text-pink-700 text-sm hover:bg-pink-50"
          >
            Open full mentorship suite (chat, video, workspace, goals, notes)
          </Link>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Last 7 check-ins
          </h2>
          {checkins.length === 0 ? (
            <p className="text-sm text-gray-500">No check-ins yet.</p>
          ) : (
            <ul className="space-y-2">
              {checkins.map((row) => (
                <li
                  key={row.id}
                  className="text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <span className="font-medium">{row.date}</span> - {row.heaviness} -{" "}
                  {row.theme}
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
