"use client";

import { useState } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Monitor, Settings } from "lucide-react";

interface VideoCallProps {
  userName: string;
  partnerName: string;
}

export function VideoCall({ userName, partnerName }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const endCall = () => { setIsCallActive(false); setIsMicOn(true); setIsVideoOn(true); setIsScreenSharing(false); };

  if (!isCallActive) {
    return (
      <div className="h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-6"><VideoIcon className="w-12 h-12 text-pink-600" /></div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">Ready to connect with <span className="text-pink-600">{partnerName}</span>?</h1>
            <p className="text-lg text-gray-600 mb-8">Start a video call to have a face-to-face conversation</p>
            <div className="bg-gradient-to-br from-pink-50 to-coral-50 rounded-xl p-6 mb-8 border-2 border-pink-200">
              <h3 className="font-semibold text-gray-900 mb-3">Before you start:</h3>
              <ul className="space-y-2 text-left text-gray-700">
                <li className="flex items-start gap-2"><span className="text-pink-600 mt-1">✓</span><span>Make sure you&apos;re in a quiet space</span></li>
                <li className="flex items-start gap-2"><span className="text-pink-600 mt-1">✓</span><span>Check your camera and microphone</span></li>
                <li className="flex items-start gap-2"><span className="text-pink-600 mt-1">✓</span><span>Have your questions or discussion topics ready</span></li>
              </ul>
            </div>
            <button onClick={() => setIsCallActive(true)} className="px-12 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all">Start Video Call</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 relative p-4">
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
          {isScreenSharing ? (
            <div className="text-center"><Monitor className="w-24 h-24 text-gray-600 mx-auto mb-4" /><p className="text-gray-400 text-lg">Screen sharing active</p></div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-600 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-5xl text-white font-semibold">{partnerName.charAt(0)}</span></div>
              <p className="text-white text-2xl font-semibold">{partnerName}</p>
              <p className="text-gray-400 mt-2">Camera {isVideoOn ? "on" : "off"}</p>
            </div>
          )}
          <div className="absolute bottom-6 right-6 w-64 h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-2xl border-2 border-gray-600 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center"><div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-coral-400 rounded-full flex items-center justify-center mx-auto"><span className="text-3xl text-white font-semibold">{userName.charAt(0)}</span></div><p className="text-white text-sm mt-2">You</p></div>
            ) : (
              <div className="text-center"><VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" /><p className="text-gray-400 text-sm">Camera off</p></div>
            )}
          </div>
          <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white font-semibold"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>12:34</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <button onClick={() => setIsMicOn(!isMicOn)} className={`p-4 rounded-full transition-all ${isMicOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>{isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}</button>
          <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-4 rounded-full transition-all ${isVideoOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>{isVideoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}</button>
          <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-4 rounded-full transition-all ${isScreenSharing ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}><Monitor className="w-6 h-6" /></button>
          <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all"><Settings className="w-6 h-6" /></button>
          <button onClick={endCall} className="p-4 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-2 font-semibold ml-4"><Phone className="w-6 h-6 rotate-135" /> End Call</button>
        </div>
        <div className="max-w-4xl mx-auto mt-4 text-center">
          {!isMicOn && <p className="text-yellow-400 text-sm">Your microphone is muted</p>}
          {!isVideoOn && <p className="text-yellow-400 text-sm">Your camera is off</p>}
          {isScreenSharing && <p className="text-pink-400 text-sm">You are sharing your screen</p>}
        </div>
      </div>
    </div>
  );
}
