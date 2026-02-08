"use client";

import { Clock, Users, Sparkles, CheckCircle } from "lucide-react";

interface WaitingForMatchProps {
  userName: string;
  userType: "novice" | "veteran";
}

export function WaitingForMatch({ userName, userType }: WaitingForMatchProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="MeeTchr" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl mb-2">Welcome to <span className="text-pink-600">MeeTchr</span>, {userName}!</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-pink-200">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center"><Users className="w-12 h-12 text-pink-600" /></div>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Finding Your Perfect {userType === "novice" ? "Mentor" : "Mentee"}...</h2>
          <p className="text-xl text-gray-600 mb-8">
            {userType === "novice" 
              ? "We're matching you with an experienced mentor who shares your interests and teaching style. This usually takes 24-48 hours."
              : "We're finding a novice teacher who would benefit from your expertise and experience. This usually takes 24-48 hours."}
          </p>
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div><h3 className="font-semibold text-gray-900 mb-1">Survey Complete</h3><p className="text-sm text-gray-600">You&apos;ve completed the 41-question matching survey</p></div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
              <div className="w-6 h-6 flex-shrink-0 mt-0.5 relative">
                <div className="absolute inset-0 bg-pink-600 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-pink-600 rounded-full"></div>
                <Clock className="w-6 h-6 text-white absolute inset-0 p-1" />
              </div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Matching in Progress</h3><p className="text-sm text-gray-600">Our algorithm is finding {userType === "novice" ? "a veteran mentor" : "a novice teacher"} with complementary goals</p></div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-50">
              <Sparkles className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
              <div><h3 className="font-semibold text-gray-900 mb-1">Meet Your Match</h3><p className="text-sm text-gray-600">You&apos;ll receive an email when your {userType === "novice" ? "mentor" : "mentee"} is ready to connect</p></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-coral-50 to-pink-50 rounded-xl p-6 border-2 border-coral-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5 text-coral-500" /> What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700 text-left">
              <li className="flex items-start gap-2"><span className="text-pink-600 font-bold mt-0.5">1.</span><span>We&apos;ll notify you via email when your match is ready</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-600 font-bold mt-0.5">2.</span><span>You&apos;ll be able to access your full portal with chat, video calls, and resources</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-600 font-bold mt-0.5">3.</span><span>Start building a meaningful mentorship relationship!</span></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">Questions? Email us at <a href="mailto:support@meetchr.com" className="text-pink-600 hover:text-pink-700 font-semibold">support@meetchr.com</a></p>
        </div>
      </div>
    </div>
  );
}
