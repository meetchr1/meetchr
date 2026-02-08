"use client";

import { useState } from "react";
import {
  Sparkles,
  MessageCircleHeart,
  Coffee,
  Target,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Shuffle,
} from "lucide-react";

/* ── Prompt data ────────────────────────────────────────────────────── */

interface Prompt {
  id: string;
  text: string;
  followUp?: string;
}

interface PromptCategory {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  prompts: Prompt[];
}

const CATEGORIES: PromptCategory[] = [
  {
    key: "icebreaker",
    label: "Ice Breakers",
    icon: Coffee,
    color: "text-amber-600",
    bg: "bg-amber-50",
    prompts: [
      {
        id: "ib1",
        text: "What\u2019s one thing that made you smile in your classroom this week?",
        followUp: "Share yours first to set a warm tone.",
      },
      {
        id: "ib2",
        text: "If you could teach any subject for a day, what would it be and why?",
      },
      {
        id: "ib3",
        text: "What\u2019s a funny or unexpected thing a student said recently?",
      },
      {
        id: "ib4",
        text: "Describe your ideal classroom in three words.",
        followUp: "Compare your answers \u2014 where do they overlap?",
      },
      {
        id: "ib5",
        text: "What\u2019s one thing outside of teaching that recharges you?",
      },
      {
        id: "ib6",
        text: "If your teaching style were a movie genre, what would it be?",
      },
    ],
  },
  {
    key: "reflection",
    label: "Reflection",
    icon: MessageCircleHeart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    prompts: [
      {
        id: "rf1",
        text: "What\u2019s a lesson you taught recently that went differently than planned? What did you learn?",
        followUp: "Discuss what you\u2019d change next time.",
      },
      {
        id: "rf2",
        text: "Think of a student who\u2019s been on your mind. What about them concerns or excites you?",
      },
      {
        id: "rf3",
        text: "What\u2019s one thing you did this week that your first-year self would be proud of?",
      },
      {
        id: "rf4",
        text: "How do you feel about your work-life balance right now? What\u2019s one small shift you could make?",
        followUp: "Hold each other accountable next check-in.",
      },
      {
        id: "rf5",
        text: "When was the last time you asked for help at work? How did it go?",
      },
      {
        id: "rf6",
        text: "What\u2019s a professional boundary you\u2019re proud of setting this year?",
      },
    ],
  },
  {
    key: "goals",
    label: "Goal Setting",
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    prompts: [
      {
        id: "gs1",
        text: "Name one teaching skill you want to improve by the end of this semester. What\u2019s step one?",
        followUp: "Write it down together and revisit in two weeks.",
      },
      {
        id: "gs2",
        text: "What\u2019s a classroom routine that isn\u2019t working? Brainstorm a replacement together.",
      },
      {
        id: "gs3",
        text: "Set a \u201Cmicro-goal\u201D for this week \u2014 something tiny but meaningful you can accomplish in your classroom.",
      },
      {
        id: "gs4",
        text: "Where do you see yourself in your teaching career one year from now?",
        followUp: "Identify one action that moves you toward that vision.",
      },
      {
        id: "gs5",
        text: "Is there a professional development topic you\u2019ve been wanting to explore? Plan how to start.",
      },
    ],
  },
  {
    key: "problem",
    label: "Problem Solving",
    icon: Lightbulb,
    color: "text-purple-600",
    bg: "bg-purple-50",
    prompts: [
      {
        id: "ps1",
        text: "A student refuses to participate in group work. Walk through three strategies you\u2019d try.",
        followUp: "Role-play the conversation together.",
      },
      {
        id: "ps2",
        text: "Your next observation is in two days and you\u2019re not feeling prepared. What\u2019s your game plan?",
      },
      {
        id: "ps3",
        text: "A parent emails you upset about a grade. Draft your response together.",
      },
      {
        id: "ps4",
        text: "You notice two students consistently off-task during independent work. How would you redesign that time?",
        followUp: "Try it this week and report back.",
      },
      {
        id: "ps5",
        text: "Your lesson flopped mid-way through. Walk through how you\u2019d pivot in real time.",
      },
      {
        id: "ps6",
        text: "A colleague is being dismissive of your ideas in team meetings. How would you handle it?",
      },
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────── */

export function GuidedPrompts() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [promptIndex, setPromptIndex] = useState(0);
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const category = CATEGORIES.find((c) => c.key === activeCategory)!;
  const prompt = category.prompts[promptIndex % category.prompts.length];

  const handleShuffle = () => {
    let next: number;
    do {
      next = Math.floor(Math.random() * category.prompts.length);
    } while (next === promptIndex && category.prompts.length > 1);
    setPromptIndex(next);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setUsedPrompts((prev) => new Set(prev).add(prompt.id));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setPromptIndex(0);
    setCopied(false);
  };

  const usedCount = Array.from(usedPrompts).filter((id) =>
    category.prompts.some((p) => p.id === id)
  ).length;

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
              Guided Prompts
            </h3>
            <p className="text-[11px] text-gray-500">
              {usedCount}/{category.prompts.length} discussed
            </p>
          </div>
        </div>
        <button
          onClick={handleShuffle}
          className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
          title="Shuffle prompt"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="px-3 pt-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? `${cat.bg} ${cat.color} ring-1 ring-current/20`
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active Prompt Card */}
      <div className="p-4">
        <div
          className={`${category.bg} border border-current/10 rounded-xl p-4 mb-3 relative`}
          style={{ borderColor: "transparent" }}
        >
          {usedPrompts.has(prompt.id) && (
            <span className="absolute top-2 right-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Discussed
            </span>
          )}

          <p className="text-sm font-medium text-gray-900 leading-relaxed pr-16">
            {prompt.text}
          </p>

          {prompt.followUp && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Tip: {prompt.followUp}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/50">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-pink-600"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Prompt
                </>
              )}
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 text-gray-600 hover:bg-white hover:text-pink-600 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Next
            </button>
          </div>
        </div>

        {/* Browse All in Category */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-xs text-gray-500 font-medium">
            Browse all {category.label.toLowerCase()} ({category.prompts.length})
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="space-y-1.5 mt-1">
            {category.prompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setPromptIndex(idx);
                  setCopied(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                  p.id === prompt.id
                    ? "bg-pink-50 text-pink-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {usedPrompts.has(p.id) ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-gray-300 block" />
                  )}
                </span>
                <span className="leading-relaxed line-clamp-2">{p.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
