"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle } from "lucide-react";

interface ChatProps {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
}

const weeklyPrompts = [
  "What was your biggest classroom win this week?",
  "What's one thing that surprised you this week?",
  "How did you handle your toughest moment this week?",
  "What made you smile in class this week?",
  "What's something new you tried this week?",
  "What are you most proud of from this week?",
  "What's one thing you want to improve next week?",
  "What strategy worked really well this week?",
  "How are your students progressing?",
  "What lesson flopped and what did you learn?",
  "What's giving you energy right now?",
  "What's draining your energy lately?",
  "How are you taking care of yourself?",
  "What boundary did you successfully maintain?",
  "What would you do differently next time?"
];

interface Message {
  id: number;
  sender: "me" | "partner";
  text: string;
  timestamp: Date;
}

export function Chat({ userName, partnerName, userType }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "partner", text: "Hey! How's your week going?", timestamp: new Date(Date.now() - 3600000) },
    { id: 2, sender: "me", text: "Pretty good! Just finished a lesson on fractions that actually went well.", timestamp: new Date(Date.now() - 3000000) },
    { id: 3, sender: "partner", text: "That's awesome! Fractions can be tricky. What approach did you use?", timestamp: new Date(Date.now() - 2400000) }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [currentPrompt] = useState(() => weeklyPrompts[Math.floor(Math.random() * weeklyPrompts.length)]);
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [sosNotificationSent, setSosNotificationSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const message: Message = { id: messages.length + 1, sender: "me", text: newMessage, timestamp: new Date() };
    setMessages([...messages, message]);
    setNewMessage("");
    setTimeout(() => {
      const responses = ["That's a great point!", "I totally understand what you mean.", "Thanks for sharing that with me!", "That's really helpful to know.", "I appreciate you opening up about that."];
      const response: Message = { id: messages.length + 2, sender: "partner", text: responses[Math.floor(Math.random() * responses.length)], timestamp: new Date() };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleSOSConfirm = () => {
    setSosNotificationSent(true);
    setShowSOSConfirm(false);
    const sosMessage: Message = { id: messages.length + 1, sender: "me", text: "🚨 SOS: I need urgent help with a classroom situation. Can you call me ASAP?", timestamp: new Date() };
    setMessages(prev => [...prev, sosMessage]);
    setTimeout(() => {
      const response: Message = { id: messages.length + 2, sender: "partner", text: "I just got your SOS notification! Calling you now...", timestamp: new Date() };
      setMessages(prev => [...prev, response]);
    }, 1000);
    setTimeout(() => { setSosNotificationSent(false); }, 5000);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className="h-screen flex flex-col">
      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div>
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-3">Send SOS Alert?</h3>
            <p className="text-gray-600 text-center mb-6">This will send an urgent notification to {partnerName} and they&apos;ll be alerted to reach out to you immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowSOSConfirm(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all">Cancel</button>
              <button onClick={handleSOSConfirm} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all font-semibold">Send SOS</button>
            </div>
          </div>
        </div>
      )}
      {sosNotificationSent && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <AlertCircle className="w-6 h-6" /><span className="font-semibold">SOS sent! {partnerName} has been notified.</span>
        </div>
      )}
      <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Chat with <span className="text-pink-600">{partnerName}</span></h2>
        {userType === "novice" && (
          <button onClick={() => setShowSOSConfirm(true)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2 font-semibold animate-pulse hover:animate-none">
            <AlertCircle className="w-5 h-5" /> SOS / Panic
          </button>
        )}
      </div>
      <div className="bg-gradient-to-r from-pink-50 to-coral-50 border-b-2 border-pink-200 px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><Sparkles className="w-5 h-5 text-pink-600" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-gray-900">Weekly Prompt</h3><span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">NEW</span></div>
              <p className="text-gray-700 mb-2">{currentPrompt}</p>
              <button onClick={() => setNewMessage(currentPrompt)} className="text-sm text-pink-600 hover:text-pink-700 font-semibold hover:underline">Use this prompt →</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md px-4 py-3 rounded-2xl ${message.sender === "me" ? "bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-br-sm" : "bg-white text-gray-900 shadow-sm rounded-bl-sm"}`}>
                <p className="mb-1">{message.text}</p>
                <p className={`text-xs ${message.sender === "me" ? "text-pink-100" : "text-gray-500"}`}>{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 px-8 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder={`Message ${partnerName}...`} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <button onClick={handleSendMessage} disabled={newMessage.trim() === ""} className="px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <Send className="w-5 h-5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
