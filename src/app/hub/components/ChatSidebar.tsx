"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Smile,
  Heart,
  User,
  Siren,
  X,
  MessageCircleWarning,
  MonitorSmartphone,
  Mail,
  Repeat2,
  HeartHandshake,
  BrainCircuit,
  Presentation,
  Coffee,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Message {
  id: string;
  sender: "me" | "partner";
  text: string;
  time: string;
  type?: "normal" | "sos";
  sosLabel?: string;
}

interface SosOption {
  label: string;
  description: string;
  icon: React.ElementType;
  /** "both" = shown to everyone; "mentor" = only mentors see it; "novice" = only novices */
  forRole: "both" | "mentor" | "novice";
}

/* ── Quick-support options (bidirectional) ───────────────────────────── */

const SOS_OPTIONS: SosOption[] = [
  {
    label: "Need a vent session",
    description: "Just need someone to listen right now",
    icon: Coffee,
    forRole: "both",
  },
  {
    label: "Need an email proofread",
    description: "Help reviewing a parent/admin email",
    icon: Mail,
    forRole: "both",
  },
  {
    label: "Help with a lesson pivot",
    description: "My lesson plan isn\u2019t working \u2014 need ideas fast",
    icon: Repeat2,
    forRole: "both",
  },
  {
    label: "Classroom crisis support",
    description: "Tough situation \u2014 could use your guidance",
    icon: HeartHandshake,
    forRole: "novice",
  },
  {
    label: "Observation prep help",
    description: "Admin observation coming up \u2014 help me prepare",
    icon: Presentation,
    forRole: "novice",
  },
  {
    label: "Tech support",
    description: "Help me with a tool, app, or platform",
    icon: MonitorSmartphone,
    forRole: "mentor",
  },
  {
    label: "Fresh-eyes lesson review",
    description: "Could use a new perspective on my lesson",
    icon: BrainCircuit,
    forRole: "mentor",
  },
];

/* ── Placeholder messages ───────────────────────────────────────────── */

const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "partner",
    text: "Hey! How did that lesson on fractions go? I know you were nervous about it.",
    time: "9:12 AM",
  },
  {
    id: "2",
    sender: "me",
    text: "It actually went so much better than I expected! The hands-on activity you suggested was a game changer.",
    time: "9:15 AM",
  },
  {
    id: "3",
    sender: "partner",
    text: "That makes my whole day! I knew the pizza method would click with them. You\u2019ve got great instincts.",
    time: "9:17 AM",
  },
  {
    id: "4",
    sender: "me",
    text: "Thank you for believing in me. Quick question \u2014 how do you handle it when a student just checks out during group work?",
    time: "9:20 AM",
  },
  {
    id: "5",
    sender: "partner",
    text: "Great question! I usually give them a specific role \u2014 like the \u201CTime Keeper\u201D or \u201CSupply Manager.\u201D It gives them ownership without pressure. Want me to share my role cards?",
    time: "9:23 AM",
  },
];

/* ── Component ──────────────────────────────────────────────────────── */

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>(PLACEHOLDER_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [sosOpen, setSosOpen] = useState(false);
  const sosRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close the SOS menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sosRef.current && !sosRef.current.contains(e.target as Node)) {
        setSosOpen(false);
      }
    }
    if (sosOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sosOpen]);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Handlers ─────────────────────────────────────────────────────── */

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSos = (option: SosOption) => {
    const msg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: option.description,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "sos",
      sosLabel: option.label,
    };

    setMessages((prev) => [...prev, msg]);
    setSosOpen(false);

    // TODO: Send high-priority push notification to partner via API
  };

  /* ── Visible options (both + role-specific) ───────────────────────── */
  // In production this would be driven by the logged-in user's role.
  // For now we show everything so both mentors and novices can test the UI.
  const visibleOptions = SOS_OPTIONS;

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ── Chat Header ──────────────────────────────────────────────── */}
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-coral-50 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-coral-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-pink-700" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              Your Mentor
            </h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Online now
            </p>
          </div>

          {/* ── SOS Button ───────────────────────────────────────────── */}
          <div className="relative" ref={sosRef}>
            <button
              onClick={() => setSosOpen((prev) => !prev)}
              aria-label="Quick support"
              className={`relative p-2 rounded-xl transition-all ${
                sosOpen
                  ? "bg-red-100 text-red-600"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Siren className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center">
                  !
                </span>
              </span>
            </button>

            {/* ── SOS Popover Menu ────────────────────────────────────── */}
            {sosOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Menu Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircleWarning className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      Quick Support
                    </span>
                  </div>
                  <button
                    onClick={() => setSosOpen(false)}
                    aria-label="Close quick support menu"
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="px-4 pt-3 pb-1 text-[11px] text-gray-500 leading-snug">
                  Sends a <span className="font-semibold text-red-500">high-priority</span> alert
                  to your partner. They&apos;ll be notified immediately.
                </p>

                {/* Option List */}
                <div className="p-2 max-h-72 overflow-y-auto">
                  {/* Shared options */}
                  <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    For everyone
                  </p>
                  {visibleOptions
                    .filter((o) => o.forRole === "both")
                    .map((option) => (
                      <SosOptionButton
                        key={option.label}
                        option={option}
                        onSelect={handleSos}
                      />
                    ))}

                  {/* Novice-specific */}
                  {visibleOptions.some((o) => o.forRole === "novice") && (
                    <>
                      <p className="px-2 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Mentee &rarr; Mentor
                      </p>
                      {visibleOptions
                        .filter((o) => o.forRole === "novice")
                        .map((option) => (
                          <SosOptionButton
                            key={option.label}
                            option={option}
                            onSelect={handleSos}
                          />
                        ))}
                    </>
                  )}

                  {/* Mentor-specific */}
                  {visibleOptions.some((o) => o.forRole === "mentor") && (
                    <>
                      <p className="px-2 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Mentor &rarr; Mentee
                      </p>
                      {visibleOptions
                        .filter((o) => o.forRole === "mentor")
                        .map((option) => (
                          <SosOptionButton
                            key={option.label}
                            option={option}
                            onSelect={handleSos}
                          />
                        ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) =>
          msg.type === "sos" ? (
            <SosMessageBubble key={msg.id} message={msg} />
          ) : (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === "me"
                    ? "bg-gradient-to-br from-pink-500 to-coral-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[11px] mt-1 ${
                    msg.sender === "me" ? "text-pink-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-end gap-2">
          <button aria-label="Emoji" className="p-2 text-gray-400 hover:text-pink-500 transition-colors shrink-0">
            <Smile className="w-5 h-5" />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            aria-label="Send message"
            className="p-2.5 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

/** A single option row inside the SOS popover */
function SosOptionButton({
  option,
  onSelect,
}: {
  option: SosOption;
  onSelect: (o: SosOption) => void;
}) {
  const Icon = option.icon;

  return (
    <button
      onClick={() => onSelect(option)}
      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-50 transition-colors group"
    >
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
        <Icon className="w-4 h-4 text-red-500" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">
          {option.label}
        </p>
        <p className="text-[11px] text-gray-500 leading-snug">
          {option.description}
        </p>
      </div>
    </button>
  );
}

/** Distinct high-priority SOS message bubble */
function SosMessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl overflow-hidden border-2 ${
          isMe
            ? "border-red-300 rounded-br-md"
            : "border-orange-300 rounded-bl-md"
        }`}
      >
        {/* SOS banner */}
        <div
          className={`px-3 py-1.5 flex items-center gap-2 ${
            isMe
              ? "bg-gradient-to-r from-red-500 to-orange-500"
              : "bg-gradient-to-r from-orange-500 to-red-500"
          }`}
        >
          <Siren className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wide">
            SOS &middot; {message.sosLabel ?? "Quick Support"}
          </span>
        </div>

        {/* Body */}
        <div
          className={`px-4 py-3 ${
            isMe ? "bg-red-50" : "bg-orange-50"
          }`}
        >
          <p className="text-sm text-gray-800 leading-relaxed">
            {message.text}
          </p>
          <p className="text-[11px] mt-1.5 text-gray-400">{message.time}</p>
        </div>
      </div>
    </div>
  );
}
