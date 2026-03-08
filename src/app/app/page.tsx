"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const HEAVINESS_OPTIONS = ["light", "manageable", "heavy", "not_ok"] as const;
const THEME_OPTIONS = ["classroom", "planning", "parents", "admin", "self"] as const;

type Heaviness = (typeof HEAVINESS_OPTIONS)[number];
type Theme = (typeof THEME_OPTIONS)[number];

type CheckinRow = {
  id: string;
  date: string;
  heaviness: Heaviness;
  theme: Theme;
  note: string | null;
};

export default function TeacherHomePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [name, setName] = useState("Teacher");
  const [userId, setUserId] = useState<string | null>(null);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [heaviness, setHeaviness] = useState<Heaviness | null>(null);
  const [theme, setTheme] = useState<Theme>("classroom");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const loadData = useCallback(async () => {
    setError(null);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login?redirect=/app");
      return;
    }

    setUserId(user.id);

    const profileUpsert = await supabase.from("profiles").upsert(
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

    if (profileUpsert.error) {
      setError(profileUpsert.error.message);
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
    setTheme(todayRow?.theme ?? "classroom");
    setNote(todayRow?.note ?? "");
  }, [router, supabase, today]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await loadData();
      if (active) {
        setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !heaviness) return;

    setSaving(true);
    setError(null);
    const { error: upsertError } = await supabase.from("checkins").upsert(
      {
        user_id: userId,
        date: today,
        heaviness,
        theme,
        note: note.trim() || null,
      },
      { onConflict: "user_id,date" }
    );

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    await loadData();
    setSaving(false);
  };

  const handleSignOut = async () => {
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
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Home</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              AI coach chat
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Peer help network
            </Link>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Academy
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <p className="text-gray-600">Hi {name}, how are you feeling today?</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-gray-200 space-y-5">
          <section>
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              How heavy does today feel?
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
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>

          <section>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!heaviness || saving}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm hover:bg-pink-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save today"}
          </button>
        </form>

        <section className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Last 7 check-ins</h2>
          {checkins.length === 0 ? (
            <p className="text-sm text-gray-500">No check-ins yet.</p>
          ) : (
            <ul className="space-y-2">
              {checkins.map((row) => (
                <li key={row.id} className="text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-b-0">
                  <span className="font-medium">{row.date}</span> - {row.heaviness} - {row.theme}
                  {row.note ? ` - ${row.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
