"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  X,
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Video,
  MessageCircle,
  ClipboardList,
  Users,
  Check,
  Trash2,
} from "lucide-react";

/* ── Types & data ───────────────────────────────────────────────────── */

interface ScheduledSession {
  id: string;
  title: string;
  type: SessionType;
  date: Date;
  time: string;
  duration: number; // minutes
  reminder: ReminderOption;
  confirmed: boolean;
}

type SessionType = "checkin" | "observation" | "planning" | "open";
type ReminderOption = "none" | "15min" | "30min" | "1hr" | "1day";

const SESSION_TYPES: {
  key: SessionType;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { key: "checkin", label: "Weekly Check-in", icon: MessageCircle, color: "text-pink-600", bg: "bg-pink-50" },
  { key: "observation", label: "Observation Debrief", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "planning", label: "Lesson Planning", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "open", label: "Open Discussion", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
];

const REMINDER_OPTIONS: { key: ReminderOption; label: string }[] = [
  { key: "none", label: "No reminder" },
  { key: "15min", label: "15 minutes before" },
  { key: "30min", label: "30 minutes before" },
  { key: "1hr", label: "1 hour before" },
  { key: "1day", label: "1 day before" },
];

const DURATIONS = [15, 30, 45, 60];

/* ── Helpers ────────────────────────────────────────────────────────── */

function getWeekDays(offset: number): Date[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 + offset * 7); // Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function relativeDay(d: Date): string {
  const now = new Date();
  const diff = Math.floor((d.getTime() - now.setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return formatDate(d);
  return formatDate(d);
}

/* ── Placeholder sessions ───────────────────────────────────────────── */

function createPlaceholderSessions(): ScheduledSession[] {
  const now = new Date();
  const thu = new Date(now);
  thu.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7 || 7)); // next Thu
  const nextMon = new Date(thu);
  nextMon.setDate(thu.getDate() + 4);

  return [
    {
      id: "s1",
      title: "Weekly Check-in",
      type: "checkin",
      date: thu,
      time: "3:30 PM",
      duration: 30,
      reminder: "30min",
      confirmed: true,
    },
    {
      id: "s2",
      title: "Lesson Planning: Fractions Unit",
      type: "planning",
      date: nextMon,
      time: "4:00 PM",
      duration: 45,
      reminder: "1hr",
      confirmed: false,
    },
  ];
}

/* ── Component ──────────────────────────────────────────────────────── */

export function SmartScheduling() {
  const [sessions, setSessions] = useState<ScheduledSession[]>(createPlaceholderSessions);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // New session form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<SessionType>("checkin");
  const [formTime, setFormTime] = useState("15:30");
  const [formDuration, setFormDuration] = useState(30);
  const [formReminder, setFormReminder] = useState<ReminderOption>("30min");

  const weekDays = getWeekDays(weekOffset);
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const upcoming = [...sessions]
    .filter((s) => s.date >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleSchedule = () => {
    if (!selectedDate) return;

    const newSession: ScheduledSession = {
      id: Date.now().toString(),
      title: formTitle || SESSION_TYPES.find((t) => t.key === formType)!.label,
      type: formType,
      date: selectedDate,
      time: new Date(`2000-01-01T${formTime}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      duration: formDuration,
      reminder: formReminder,
      confirmed: false,
    };

    setSessions((prev) => [...prev, newSession]);
    setShowForm(false);
    setFormTitle("");
    setFormType("checkin");
    setFormTime("15:30");
    setFormDuration(30);
    setFormReminder("30min");
    setSelectedDate(null);
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleConfirm = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, confirmed: true } : s))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Smart Scheduling
            </h3>
            <p className="text-xs text-gray-500">
              {upcoming.length} upcoming session{upcoming.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!selectedDate) setSelectedDate(new Date());
          }}
          className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancel" : "Schedule"}
        </button>
      </div>

      {/* Mini Week Calendar */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1 text-gray-400 hover:text-pink-600 rounded transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-600">
            {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" \u2013 "}
            {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1 text-gray-400 hover:text-pink-600 rounded transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, i) => {
            const hasSessions = sessions.some((s) => isSameDay(s.date, day));
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const today = isToday(day);

            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(day);
                  if (!showForm) setShowForm(true);
                }}
                className={`flex flex-col items-center py-1.5 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-gradient-to-b from-pink-500 to-coral-500 text-white shadow-sm"
                    : today
                    ? "bg-pink-50 text-pink-700"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span
                  className={`text-[10px] font-medium ${
                    isSelected ? "text-pink-100" : "text-gray-400"
                  }`}
                >
                  {DAY_LABELS[i]}
                </span>
                <span className="text-sm font-semibold">{day.getDate()}</span>
                {hasSessions && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? "bg-white" : "bg-pink-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="px-4 py-4 bg-gradient-to-b from-pink-50/40 to-white border-b border-gray-100 space-y-3">
          <p className="text-xs font-semibold text-gray-800">
            Schedule for{" "}
            <span className="text-pink-600">
              {selectedDate ? formatDate(selectedDate) : "..."}
            </span>
          </p>

          {/* Session Type */}
          <div className="grid grid-cols-2 gap-2">
            {SESSION_TYPES.map((st) => {
              const Icon = st.icon;
              const isActive = st.key === formType;
              return (
                <button
                  key={st.key}
                  onClick={() => setFormType(st.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    isActive
                      ? `${st.bg} ${st.color} border-current/20`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Title (optional) */}
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Session title (optional)"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 placeholder-gray-400"
          />

          {/* Time & Duration */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="session-time" className="text-[11px] text-gray-500 mb-1 block">Time</label>
              <input
                id="session-time"
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-gray-500 mb-1 block">Duration</label>
              <div className="flex gap-1">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFormDuration(d)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      d === formDuration
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-1 block">
              <Bell className="w-3 h-3" />
              Reminder
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REMINDER_OPTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setFormReminder(r.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    r.key === formReminder
                      ? "bg-pink-100 text-pink-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSchedule}
            disabled={!selectedDate}
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            Schedule Session
          </button>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="p-3">
        {upcoming.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No upcoming sessions</p>
            <p className="text-xs text-gray-400 mt-1">
              Tap a day above to schedule one
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((session) => {
              const typeInfo = SESSION_TYPES.find((t) => t.key === session.type)!;
              const Icon = typeInfo.icon;

              return (
                <div
                  key={session.id}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`w-9 h-9 ${typeInfo.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relativeDay(session.date)} at {session.time}
                      </span>
                      <span className="text-xs text-gray-400">
                        {session.duration}min
                      </span>
                      {session.reminder !== "none" && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <BellRing className="w-2.5 h-2.5" />
                          {REMINDER_OPTIONS.find((r) => r.key === session.reminder)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!session.confirmed && (
                      <button
                        onClick={() => handleConfirm(session.id)}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Confirm"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {session.confirmed && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        Confirmed
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {!showForm && upcoming.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => {
                const nextSes = upcoming[0];
                if (nextSes) {
                  // Placeholder for starting a video meeting
                  alert(`Starting session: ${nextSes.title}`);
                }
              }}
              className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              Join Next Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
