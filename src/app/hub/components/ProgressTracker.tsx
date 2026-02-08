"use client";

import { useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Trophy,
  Calendar,
  MessageCircle,
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  Flame,
  Star,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  week: number;
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

/* ── Data ───────────────────────────────────────────────────────────── */

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "First Connection",
    description: "Completed your profile and got matched",
    completed: true,
    week: 1,
  },
  {
    id: "m2",
    title: "Ice Breaker",
    description: "Had your first conversation with your partner",
    completed: true,
    week: 1,
  },
  {
    id: "m3",
    title: "First Video Session",
    description: "Completed your first face-to-face meeting",
    completed: true,
    week: 2,
  },
  {
    id: "m4",
    title: "Goal Setter",
    description: "Set your first mentorship goals together",
    completed: true,
    week: 3,
  },
  {
    id: "m5",
    title: "One Month Strong",
    description: "Maintained your mentorship for 4 weeks",
    completed: true,
    week: 4,
  },
  {
    id: "m6",
    title: "Resource Sharer",
    description: "Shared 5 resources with your partner",
    completed: false,
    week: 6,
  },
  {
    id: "m7",
    title: "Deep Diver",
    description: "Discussed 10 guided conversation prompts",
    completed: false,
    week: 8,
  },
  {
    id: "m8",
    title: "Mid-Semester Check",
    description: "Completed your mid-semester reflection together",
    completed: false,
    week: 10,
  },
  {
    id: "m9",
    title: "Mentorship Master",
    description: "Completed a full semester of mentorship",
    completed: false,
    week: 18,
  },
];

const DEFAULT_GOALS: Goal[] = [
  { id: "g1", text: "Observe partner\u2019s classroom (or share a recording)", completed: true },
  { id: "g2", text: "Co-plan a lesson together", completed: true },
  { id: "g3", text: "Try a new classroom management strategy", completed: false },
  { id: "g4", text: "Share feedback on each other\u2019s teaching", completed: false },
  { id: "g5", text: "Attend a PD session together or discuss one", completed: false },
  { id: "g6", text: "Write a reflection journal entry and share it", completed: false },
];

const STATS = {
  meetingsCompleted: 8,
  weeksActive: 12,
  promptsDiscussed: 14,
  resourcesShared: 7,
  currentStreak: 4,
};

/* ── Component ──────────────────────────────────────────────────────── */

export function ProgressTracker() {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  const completedMilestones = MILESTONES.filter((m) => m.completed).length;
  const overallProgress = Math.round(
    (completedMilestones / MILESTONES.length) * 100
  );
  const completedGoals = goals.filter((g) => g.completed).length;

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    setGoals((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newGoalText.trim(), completed: false },
    ]);
    setNewGoalText("");
  };

  const visibleMilestones = showAllMilestones
    ? MILESTONES
    : MILESTONES.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Progress Tracker
            </h3>
            <p className="text-xs text-gray-500">
              {completedMilestones}/{MILESTONES.length} milestones reached
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-orange-600">
            {STATS.currentStreak} week streak
          </span>
        </div>
      </div>

      {/* Overall Progress Ring */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeDasharray={`${overallProgress}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {overallProgress}%
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
            <Stat icon={Calendar} label="Meetings" value={STATS.meetingsCompleted} />
            <Stat icon={MessageCircle} label="Prompts" value={STATS.promptsDiscussed} />
            <Stat icon={BookOpen} label="Resources" value={STATS.resourcesShared} />
            <Stat icon={Star} label="Weeks Active" value={STATS.weeksActive} />
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="px-5 pb-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Milestones
        </h4>
        <div className="space-y-0">
          {visibleMilestones.map((milestone, i) => {
            const isLast = i === visibleMilestones.length - 1;
            return (
              <div key={milestone.id} className="flex gap-3">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        milestone.completed ? "bg-pink-200" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-4 ${isLast ? "pb-2" : ""}`}>
                  <p
                    className={`text-sm font-medium ${
                      milestone.completed ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {milestone.title}
                    {milestone.completed && (
                      <Trophy className="w-3 h-3 text-amber-500 inline ml-1.5" />
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {MILESTONES.length > 5 && (
          <button
            onClick={() => setShowAllMilestones(!showAllMilestones)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-500 hover:text-pink-600 transition-colors"
          >
            {showAllMilestones ? (
              <>
                Show less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show all milestones <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Goals Section */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Goals
          </h4>
          <span className="text-[11px] text-pink-600 font-medium">
            {completedGoals}/{goals.length} done
          </span>
        </div>

        {/* Goal progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-coral-500 rounded-full transition-all duration-500"
            style={{
              width: `${goals.length > 0 ? (completedGoals / goals.length) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Goals list */}
        <div className="space-y-1.5 mb-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className="w-full flex items-start gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              {goal.completed ? (
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 group-hover:text-pink-300 shrink-0 mt-0.5 transition-colors" />
              )}
              <span
                className={`text-sm ${
                  goal.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
              >
                {goal.text}
              </span>
            </button>
          ))}
        </div>

        {/* Add goal */}
        <div className="flex gap-2">
          <input
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="Add a new goal..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 placeholder-gray-400"
          />
          <button
            onClick={addGoal}
            disabled={!newGoalText.trim()}
            className="px-3 py-2 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all disabled:opacity-40 flex items-center gap-1"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Stat helper ────────────────────────────────────────────────────── */

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <div>
        <p className="text-sm font-bold text-gray-900">{value}</p>
        <p className="text-[10px] text-gray-400">{label}</p>
      </div>
    </div>
  );
}
