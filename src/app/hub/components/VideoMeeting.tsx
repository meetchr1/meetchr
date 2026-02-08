"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { DailyCall } from "@daily-co/daily-js";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Phone,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Check,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────── */

type CallState = "idle" | "creating" | "joining" | "joined" | "error";

/* ── Component ──────────────────────────────────────────────────────── */

export function VideoMeeting() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<DailyCall | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Cleanup ────────────────────────────────────────────────────── */

  const destroyCall = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (callRef.current) {
      callRef.current.destroy();
      callRef.current = null;
    }
    setCallState("idle");
    setRoomUrl(null);
    setError(null);
    setIsMuted(false);
    setIsVideoOn(true);
    setElapsedSeconds(0);
    setCopied(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callRef.current) callRef.current.destroy();
    };
  }, []);

  /* ── Start a call ───────────────────────────────────────────────── */

  const startCall = useCallback(async () => {
    setCallState("creating");
    setError(null);

    try {
      // 1. Create a room via our API
      const res = await fetch("/api/daily/room", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not create room.");
      }

      setRoomUrl(data.url);
      setCallState("joining");

      // 2. Create the Daily call frame inside our container
      if (!containerRef.current) throw new Error("Video container not ready.");

      // Dynamic import — keeps the large SDK out of the server bundle
      const DailyIframe = (await import("@daily-co/daily-js")).default;

      const call = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "0",
        },
        showLeaveButton: false,
        showFullscreenButton: true,
      });

      callRef.current = call;

      // 3. Listen to events
      call.on("joined-meeting", () => {
        setCallState("joined");
        // Start the elapsed timer
        timerRef.current = setInterval(() => {
          setElapsedSeconds((s) => s + 1);
        }, 1000);
      });

      call.on("left-meeting", () => {
        destroyCall();
      });

      call.on("error", (ev) => {
        console.error("Daily error:", ev);
        setError("Something went wrong with the video call.");
        setCallState("error");
      });

      // 4. Join the room
      await call.join({ url: data.url });
    } catch (err) {
      console.error("Start call error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start video call."
      );
      setCallState("error");
    }
  }, [destroyCall]);

  /* ── Controls ───────────────────────────────────────────────────── */

  const toggleMute = useCallback(() => {
    if (!callRef.current) return;
    const next = !isMuted;
    callRef.current.setLocalAudio(!next);
    setIsMuted(next);
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (!callRef.current) return;
    const next = !isVideoOn;
    callRef.current.setLocalVideo(next);
    setIsVideoOn(next);
  }, [isVideoOn]);

  const shareScreen = useCallback(() => {
    if (!callRef.current) return;
    callRef.current.startScreenShare();
  }, []);

  const leaveCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.leave();
    }
    destroyCall();
  }, [destroyCall]);

  const copyRoomLink = useCallback(async () => {
    if (!roomUrl) return;
    await navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [roomUrl]);

  /* ── Format timer ───────────────────────────────────────────────── */

  const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const secs = String(elapsedSeconds % 60).padStart(2, "0");

  /* ── Pre-call screen ────────────────────────────────────────────── */

  if (callState === "idle" || callState === "error") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-8 lg:p-10 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Video className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready for your next session?
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Connect face-to-face with your teaching partner. Video sessions
            build stronger mentorship bonds.
          </p>

          {error && (
            <div className="mb-4 mx-auto max-w-sm bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startCall}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Video className="w-4 h-4" />
              Start Meeting Now
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-medium border border-white/10">
              <Calendar className="w-4 h-4" />
              Schedule for Later
            </button>
          </div>
        </div>

        {/* Upcoming session hint */}
        <div className="px-5 py-4 bg-gradient-to-r from-pink-50/50 to-coral-50/50 flex items-center gap-3">
          <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-pink-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">
              Next scheduled session
            </p>
            <p className="text-xs text-gray-500">
              Thursday at 3:30 PM &mdash; Weekly Check-in
            </p>
          </div>
          <span className="text-xs text-pink-600 font-medium bg-pink-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            In 2 days
          </span>
        </div>
      </div>
    );
  }

  /* ── Creating / Joining spinner ─────────────────────────────────── */

  if (callState === "creating" || callState === "joining") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-12 text-center">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">
            {callState === "creating"
              ? "Creating your room..."
              : "Joining the call..."}
          </h3>
          <p className="text-sm text-gray-400">
            This only takes a moment
          </p>
        </div>
      </div>
    );
  }

  /* ── In-call screen ─────────────────────────────────────────────── */

  return (
    <div className="bg-navy-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      {/* Daily iframe container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video"
      >
        {/* Call duration overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">
            {mins}:{secs}
          </span>
        </div>
      </div>

      {/* Custom Controls Bar */}
      <div className="px-4 py-3 flex items-center justify-center gap-3 bg-navy-800/50">
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isMuted
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          title={isVideoOn ? "Turn off camera" : "Turn on camera"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            !isVideoOn
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={shareScreen}
          title="Share screen"
          className="w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
        >
          <MonitorUp className="w-5 h-5" />
        </button>

        <button
          onClick={copyRoomLink}
          title="Copy invite link"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
        </button>

        <button
          onClick={leaveCall}
          title="Leave call"
          className="w-11 h-11 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all shadow-lg shadow-red-500/25"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
}
