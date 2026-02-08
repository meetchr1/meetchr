"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  LayoutDashboard,
  BookMarked,
  LogOut,
  User,
  Home,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { ChatSidebar } from "./components/ChatSidebar";
import { VideoMeeting } from "./components/VideoMeeting";
import { SharedFiles } from "./components/SharedFiles";
import { WeeklyVibeCheck } from "./components/WeeklyVibeCheck";
import { GuidedPrompts } from "./components/GuidedPrompts";
import { ResourceLibrary } from "./components/ResourceLibrary";
import { SmartScheduling } from "./components/SmartScheduling";
import { ProgressTracker } from "./components/ProgressTracker";

type MobileTab = "chat" | "workspace" | "resources";

export default function MentorshipHub() {
  const router = useRouter();
  const [mobileTab, setMobileTab] = useState<MobileTab>("workspace");
  const [userName, setUserName] = useState("Teacher");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Teacher"
        );
      }
    });
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await fetch("/api/auth/signout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50/80">
      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shrink-0 z-30">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + back */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <Image src="/logo.png" alt="MeeTchr" width={32} height={32} />
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent hidden sm:inline">
                MeeTchr
              </span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1" />

            <h1 className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700">
              <LayoutDashboard className="w-4 h-4 text-pink-500" />
              Mentorship Hub
            </h1>
          </div>

          {/* Right: User + actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-pink-50"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:block">
                {userName}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Tab Bar ─────────────────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-gray-200 shrink-0">
        <div className="flex">
          {(
            [
              { key: "chat", label: "Chat", icon: MessageCircle },
              { key: "workspace", label: "Workspace", icon: LayoutDashboard },
              { key: "resources", label: "Resources", icon: BookMarked },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = mobileTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors relative ${
                  isActive
                    ? "text-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-pink-500 to-coral-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main 3-Column Layout ───────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <div className="h-full flex">
          {/* ── Left: Chat Sidebar ──────────────────────────────────────── */}
          <div
            className={`${
              mobileTab === "chat" ? "flex" : "hidden"
            } lg:flex w-full lg:w-80 xl:w-96 shrink-0 p-3 lg:p-4 min-h-0`}
          >
            <div className="w-full min-h-0 h-full">
              <ChatSidebar />
            </div>
          </div>

          {/* ── Center: Workspace ───────────────────────────────────────── */}
          <main
            className={`${
              mobileTab === "workspace" ? "block" : "hidden"
            } lg:block flex-1 min-w-0 overflow-y-auto`}
          >
            <div className="p-3 lg:p-4 lg:px-2 pb-8 space-y-4">
              <VideoMeeting />
              <SmartScheduling />
              <ProgressTracker />
              <SharedFiles />
            </div>
          </main>

          {/* ── Right: Prompts & Resources ──────────────────────────────── */}
          <div
            className={`${
              mobileTab === "resources" ? "block" : "hidden"
            } lg:block w-full lg:w-80 xl:w-96 shrink-0 overflow-y-auto`}
          >
            <div className="p-3 lg:p-4 pb-8 space-y-4">
              <WeeklyVibeCheck />
              <GuidedPrompts />
              <ResourceLibrary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
