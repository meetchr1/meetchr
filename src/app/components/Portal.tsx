"use client";

import { useState } from "react";
import { MessageSquare, Video, Home, User, LogOut, Sparkles, FolderOpen, BookOpen, Calendar, Target, FileText } from "lucide-react";
import { Chat } from "./Chat";
import { VideoCall } from "./VideoCall";
import { Workspace } from "./Workspace";
import { ResourceLibrary } from "./ResourceLibrary";
import { Schedule } from "./Schedule";
import { Goals } from "./Goals";
import { Notes } from "./Notes";
import { Profile } from "./Profile";
import { WaitingForMatch } from "./WaitingForMatch";

interface PortalProps {
  userType: "novice" | "veteran";
  userName: string;
  partnerName: string;
  isMatched?: boolean;
}

export function Portal({ userType, userName, partnerName, isMatched = true }: PortalProps) {
  const [activeView, setActiveView] = useState<"dashboard" | "chat" | "video" | "workspace" | "resources" | "schedule" | "goals" | "notes" | "profile">("dashboard");
  
  if (!isMatched) {
    return <WaitingForMatch userName={userName} userType={userType} />;
  }

  return <PortalContent userType={userType} userName={userName} partnerName={partnerName} activeView={activeView} setActiveView={setActiveView} />;
}

function PortalContent({ userType, userName, partnerName, activeView, setActiveView }: {
  userType: "novice" | "veteran";
  userName: string;
  partnerName: string;
  activeView: "dashboard" | "chat" | "video" | "workspace" | "resources" | "schedule" | "goals" | "notes" | "profile";
  setActiveView: (view: "dashboard" | "chat" | "video" | "workspace" | "resources" | "schedule" | "goals" | "notes" | "profile") => void;
}) {
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [vibeCheckSubmitted, setVibeCheckSubmitted] = useState(false);

  const handleVibeCheckSubmit = () => {
    setVibeCheckSubmitted(true);
    setTimeout(() => setVibeCheckSubmitted(false), 2000);
  };

  const navItems = [
    { key: "dashboard", icon: Home, title: "Dashboard" },
    { key: "chat", icon: MessageSquare, title: "Chat" },
    { key: "video", icon: Video, title: "Video Call" },
    { key: "workspace", icon: FolderOpen, title: "Workspace" },
    { key: "resources", icon: BookOpen, title: "Resource Library" },
    { key: "schedule", icon: Calendar, title: "Schedule" },
    { key: "goals", icon: Target, title: "Goals" },
    { key: "notes", icon: FileText, title: "Notes" },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50">
      <aside className="fixed left-0 top-0 h-full w-20 bg-navy-900 text-white flex flex-col items-center py-6 z-50">
        <img src="/logo.png" alt="MeeTchr" className="w-12 h-12 mb-8" />
        <nav className="flex-1 flex flex-col gap-6">
          {navItems.map(({ key, icon: Icon, title }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as typeof activeView)}
              className={`p-3 rounded-lg transition-all ${activeView === key ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white hover:bg-navy-800"}`}
              title={title}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
        <div className="flex flex-col gap-4">
          <button onClick={() => setActiveView("profile")} className={`p-3 rounded-lg transition-all ${activeView === "profile" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white hover:bg-navy-800"}`} title="Profile"><User className="w-6 h-6" /></button>
          <button className="p-3 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg transition-all" title="Logout"><LogOut className="w-6 h-6" /></button>
        </div>
      </aside>

      <main className="ml-20 min-h-screen">
        {activeView === "dashboard" && (
          <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl mb-2">Welcome back, <span className="text-pink-600">{userName}</span>!</h1>
              <p className="text-xl text-gray-600">{userType === "novice" ? `Your mentor ${partnerName} is here to support you` : `Your mentee ${partnerName} is excited to learn from you`}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-pink-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center"><Sparkles className="w-6 h-6 text-pink-600" /></div>
                <div><h2 className="text-2xl text-gray-900">Weekly Vibe Check</h2><p className="text-gray-600">How are you feeling this week?</p></div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3"><label className="text-gray-900 font-semibold">🎯 Confidence Level</label><span className="text-2xl font-bold text-pink-600">{confidenceLevel}/10</span></div>
                  <input type="range" min="1" max="10" value={confidenceLevel} onChange={(e) => setConfidenceLevel(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600" style={{ background: `linear-gradient(to right, #FF0080 0%, #FF0080 ${(confidenceLevel - 1) * 11.11}%, #e5e7eb ${(confidenceLevel - 1) * 11.11}%, #e5e7eb 100%)` }} />
                  <div className="flex justify-between text-sm text-gray-500 mt-1"><span>Just surviving</span><span>Crushing it!</span></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3"><label className="text-gray-900 font-semibold">⚡ Energy Level</label><span className="text-2xl font-bold text-coral-500">{energyLevel}/10</span></div>
                  <input type="range" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral-500" style={{ background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${(energyLevel - 1) * 11.11}%, #e5e7eb ${(energyLevel - 1) * 11.11}%, #e5e7eb 100%)` }} />
                  <div className="flex justify-between text-sm text-gray-500 mt-1"><span>Running on fumes</span><span>Ready to run a marathon!</span></div>
                </div>
                <button onClick={handleVibeCheckSubmit} disabled={vibeCheckSubmitted} className={`w-full py-3 rounded-lg font-semibold transition-all ${vibeCheckSubmitted ? "bg-green-500 text-white" : "bg-gradient-to-r from-pink-600 to-coral-500 text-white hover:shadow-lg"}`}>
                  {vibeCheckSubmitted ? "✓ Vibe Check Saved!" : "Submit Vibe Check"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => setActiveView("chat")} className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-600 text-left group">
                <MessageSquare className="w-12 h-12 text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Chatting</h3>
                <p className="text-gray-600">Continue your conversation with {partnerName}</p>
              </button>
              <button onClick={() => setActiveView("video")} className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-coral-500 text-left group">
                <Video className="w-12 h-12 text-coral-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Video Call</h3>
                <p className="text-gray-600">Connect face-to-face with {partnerName}</p>
              </button>
            </div>

            <div className="mt-8 bg-gradient-to-br from-pink-50 to-coral-50 rounded-xl p-8 border-2 border-pink-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Partnership</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center"><div className="text-3xl font-bold text-pink-600 mb-1">12</div><div className="text-gray-600">Days Connected</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-coral-500 mb-1">8</div><div className="text-gray-600">Video Calls</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-navy-900 mb-1">156</div><div className="text-gray-600">Messages Exchanged</div></div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your <span className="text-pink-600">Achievements</span></h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { emoji: "🏆", title: "First Week Complete!", desc: "Completed your first week of mentorship", border: "border-yellow-200", bg: "bg-yellow-100" },
                  { emoji: "💬", title: "Great Communicator", desc: "Sent 100+ messages", border: "border-blue-200", bg: "bg-blue-100" },
                  { emoji: "🎯", title: "Goal Setter", desc: "Created 3 teaching goals", border: "border-green-200", bg: "bg-green-100" },
                  { emoji: "📹", title: "Face Time Pro", desc: "Completed 5 video sessions", border: "border-purple-200", bg: "bg-purple-100" },
                  { emoji: "📚", title: "Knowledge Seeker", desc: "Explored 10+ resources", border: "border-pink-200", bg: "bg-pink-100" },
                  { emoji: "✍️", title: "Reflective Practitioner", desc: "Wrote 5 session notes", border: "border-coral-200", bg: "bg-coral-100" },
                ].map((achievement, idx) => (
                  <div key={idx} className={`bg-white rounded-xl shadow-md p-6 border-2 ${achievement.border}`}>
                    <div className={`w-16 h-16 ${achievement.bg} rounded-full flex items-center justify-center mx-auto mb-3`}><span className="text-3xl">{achievement.emoji}</span></div>
                    <h4 className="font-semibold text-gray-900 text-center mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 text-center">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === "chat" && <Chat userName={userName} partnerName={partnerName} userType={userType} />}
        {activeView === "video" && <VideoCall userName={userName} partnerName={partnerName} />}
        {activeView === "workspace" && <Workspace userName={userName} partnerName={partnerName} />}
        {activeView === "resources" && <ResourceLibrary />}
        {activeView === "schedule" && <Schedule userName={userName} partnerName={partnerName} userType={userType} />}
        {activeView === "goals" && <Goals userName={userName} partnerName={partnerName} userType={userType} />}
        {activeView === "notes" && <Notes userName={userName} partnerName={partnerName} userType={userType} />}
        {activeView === "profile" && <Profile userName={userName} partnerName={partnerName} userType={userType} />}
      </main>
    </div>
  );
}
