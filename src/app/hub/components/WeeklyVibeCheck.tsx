"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Check,
  Loader2,
  Flame,
  Shield,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CONFIDENCE_LABELS: Record<number, { emoji: string; label: string }> = {
  1:  { emoji: "\uD83E\uDD76", label: "Frozen" },
  2:  { emoji: "\uD83D\uDE30", label: "Shaky" },
  3:  { emoji: "\uD83D\uDE1F", label: "Unsure" },
  4:  { emoji: "\uD83E\uDD14", label: "Thinking" },
  5:  { emoji: "\uD83D\uDE10", label: "Neutral" },
  6:  { emoji: "\uD83D\uDE42", label: "Okay" },
  7:  { emoji: "\uD83D\uDE0A", label: "Solid" },
  8:  { emoji: "\uD83D\uDE04", label: "Strong" },
  9:  { emoji: "\uD83D\uDD25", label: "On Fire" },
  10: { emoji: "\uD83D\uDCAA", label: "Unstoppable" },
};

const ENERGY_LABELS: Record<number, { emoji: string; label: string }> = {
  1:  { emoji: "\uD83D\uDECC", label: "Running on Fumes" },
  2:  { emoji: "\uD83E\uDD71", label: "Dragging" },
  3:  { emoji: "\uD83D\uDE34", label: "Sluggish" },
  4:  { emoji: "\u2615",       label: "Need Coffee" },
  5:  { emoji: "\uD83D\uDE10", label: "Steady" },
  6:  { emoji: "\uD83D\uDE42", label: "Decent" },
  7:  { emoji: "\u26A1",       label: "Buzzing" },
  8:  { emoji: "\uD83D\uDE80", label: "Energized" },
  9:  { emoji: "\uD83C\uDF1F", label: "Supercharged" },
  10: { emoji: "\uD83C\uDF08", label: "Maximum Vibes" },
};

function getWeekLabel(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );
  return `Week ${week}`;
}

export function WeeklyVibeCheck() {
  const [confidence, setConfidence] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "saved" | "already"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Check if a vibe check already exists for this week
  const checkExisting = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("check_ins")
      .select("confidence, energy, note")
      .eq("user_id", user.id)
      .order("week_of", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setConfidence(data.confidence);
      setEnergy(data.energy);
      setNote(data.note || "");
      setStatus("already");
    }
  }, []);

  useEffect(() => {
    checkExisting();
  }, [checkExisting]);

  const handleSubmit = async () => {
    setStatus("loading");
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setStatus("idle");
      return;
    }

    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    const weekOf = weekStart.toISOString().split("T")[0];

    const { error: upsertError } = await supabase.from("check_ins").upsert(
      {
        user_id: user.id,
        confidence,
        energy,
        note: note.trim() || null,
        week_of: weekOf,
      },
      { onConflict: "user_id,week_of" }
    );

    if (upsertError) {
      setError("Couldn\u2019t save. Try again!");
      setStatus("idle");
      return;
    }

    setStatus("saved");
  };

  const confidenceInfo = CONFIDENCE_LABELS[confidence];
  const energyInfo = ENERGY_LABELS[energy];

  // Gradient position for the track fill (0-100%)
  const confPercent = ((confidence - 1) / 9) * 100;
  const energyPercent = ((energy - 1) / 9) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-coral-50 border-b border-pink-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-coral-200 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Weekly Vibe Check
            </h3>
            <p className="text-[11px] text-gray-500">{getWeekLabel()}</p>
          </div>
        </div>
        {status === "saved" || status === "already" ? (
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" />
            Saved
          </span>
        ) : null}
      </div>

      <div className="p-4 space-y-5">
        {/* ── Confidence Slider ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-pink-500" />
              Confidence Level
            </label>
            <span className="text-lg leading-none" title={confidenceInfo.label}>
              {confidenceInfo.emoji}
            </span>
          </div>

          {/* Custom slider track */}
          <div className="relative h-10 flex items-center">
            <div className="absolute inset-x-0 h-2.5 bg-gray-100 rounded-full" />
            <div
              className="absolute left-0 h-2.5 rounded-full bg-gradient-to-r from-pink-300 via-pink-500 to-coral-500 transition-all duration-150"
              style={{ width: `calc(${confPercent}% + ${confPercent < 5 ? 8 : 0}px)` }}
            />
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={confidence}
              aria-label="Confidence Level"
              onChange={(e) => {
                setConfidence(Number(e.target.value));
                if (status === "saved" || status === "already")
                  setStatus("idle");
              }}
              className="relative w-full h-2.5 appearance-none bg-transparent cursor-pointer z-10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-pink-500
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-pink-200
                [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-pink-500 [&::-moz-range-thumb]:shadow-md
                [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-2.5"
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-gray-400">1</span>
            <span className="text-xs font-medium text-pink-600">
              {confidence}/10 &mdash; {confidenceInfo.label}
            </span>
            <span className="text-[11px] text-gray-400">10</span>
          </div>
        </div>

        {/* ── Energy Slider ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-coral-500" />
              Energy Level
            </label>
            <span className="text-lg leading-none" title={energyInfo.label}>
              {energyInfo.emoji}
            </span>
          </div>

          <div className="relative h-10 flex items-center">
            <div className="absolute inset-x-0 h-2.5 bg-gray-100 rounded-full" />
            <div
              className="absolute left-0 h-2.5 rounded-full bg-gradient-to-r from-coral-300 via-coral-500 to-pink-500 transition-all duration-150"
              style={{ width: `calc(${energyPercent}% + ${energyPercent < 5 ? 8 : 0}px)` }}
            />
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={energy}
              aria-label="Energy Level"
              onChange={(e) => {
                setEnergy(Number(e.target.value));
                if (status === "saved" || status === "already")
                  setStatus("idle");
              }}
              className="relative w-full h-2.5 appearance-none bg-transparent cursor-pointer z-10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-coral-500
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-coral-200
                [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-coral-500 [&::-moz-range-thumb]:shadow-md
                [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-2.5"
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-gray-400">1</span>
            <span className="text-xs font-medium text-coral-600">
              {energy}/10 &mdash; {energyInfo.label}
            </span>
            <span className="text-[11px] text-gray-400">10</span>
          </div>
        </div>

        {/* ── Optional Note ────────────────────────────────────────────── */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Anything on your mind? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (status === "saved" || status === "already")
                setStatus("idle");
            }}
            placeholder="This week I felt great about..."
            rows={2}
            maxLength={280}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 resize-none placeholder-gray-400"
          />
        </div>

        {/* ── Error ────────────────────────────────────────────────────── */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* ── Submit Button ────────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "saved"}
          className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-xl text-sm font-medium
            hover:shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : status === "saved" || status === "already" ? (
            <>
              <Check className="w-4 h-4" />
              Vibes Logged
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Log My Vibes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
