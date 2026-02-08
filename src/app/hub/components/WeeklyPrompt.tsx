"use client";

import { Sparkles, ChevronRight, MessageCircleHeart } from "lucide-react";

const CURRENT_PROMPT = {
  week: 12,
  title: "Celebrate a small win this week",
  description:
    "Share one thing that went well in your classroom \u2014 no matter how small. Did a student finally understand a concept? Did your lesson plan actually go to plan? Celebrate it together!",
  tips: [
    "Start your next check-in by sharing your win",
    "Ask your partner about their highlight too",
    "Save it in your journal \u2014 you\u2019ll want to remember this later",
  ],
};

const PAST_PROMPTS = [
  { week: 11, title: "What\u2019s one thing you\u2019d do differently?" },
  { week: 10, title: "Share a lesson that surprised you" },
];

export function WeeklyPrompt() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-coral-50 border-b border-pink-100 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-coral-200 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-pink-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Weekly Prompt
          </h3>
          <p className="text-[11px] text-gray-500">Week {CURRENT_PROMPT.week}</p>
        </div>
      </div>

      {/* Current Prompt */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-pink-50 via-white to-coral-50 border border-pink-100 rounded-xl p-4 mb-3">
          <h4 className="font-semibold text-gray-900 text-sm mb-1.5 flex items-center gap-1.5">
            <MessageCircleHeart className="w-4 h-4 text-pink-500" />
            {CURRENT_PROMPT.title}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {CURRENT_PROMPT.description}
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-2 mb-4">
          {CURRENT_PROMPT.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-gray-600">{tip}</p>
            </div>
          ))}
        </div>

        {/* Past Prompts */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">
            Past Prompts
          </p>
          {PAST_PROMPTS.map((p) => (
            <button
              key={p.week}
              className="w-full flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xs text-gray-600 group-hover:text-pink-600 transition-colors">
                Week {p.week}: {p.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-pink-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
