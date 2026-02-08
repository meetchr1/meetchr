"use client";
import { useState } from "react";
import { Calendar, Clock, Video, MessageSquare, Plus, X, Check } from "lucide-react";

interface ScheduleProps {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
}

interface Session {
  id: number;
  date: Date;
  time: string;
  duration: number;
  type: "video" | "chat";
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export function Schedule({ userName, partnerName, userType }: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<"video" | "chat">("video");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingDuration, setBookingDuration] = useState(30);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "2:00 PM",
      duration: 30,
      type: "video",
      status: "upcoming"
    },
    {
      id: 2,
      date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      time: "10:00 AM",
      duration: 45,
      type: "video",
      status: "upcoming"
    },
    {
      id: 3,
      date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      time: "3:30 PM",
      duration: 30,
      type: "video",
      status: "completed",
      notes: "Discussed classroom management strategies"
    },
    {
      id: 4,
      date: new Date(Date.now() - 86400000 * 7), // 1 week ago
      time: "11:00 AM",
      duration: 60,
      type: "video",
      status: "completed",
      notes: "Reviewed lesson planning and student engagement"
    }
  ]);

  const getCurrentMonth = () => {
    return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasSession = (date: Date | null) => {
    if (!date) return false;
    return sessions.some(session => 
      session.date.toDateString() === date.toDateString()
    );
  };

  const handleBookSession = () => {
    const newSession: Session = {
      id: sessions.length + 1,
      date: new Date(selectedDate),
      time: bookingTime,
      duration: bookingDuration,
      type: bookingType,
      status: "upcoming"
    };
    setSessions([...sessions, newSession].sort((a, b) => b.date.getTime() - a.date.getTime()));
    setShowBookingModal(false);
  };

  const upcomingSessions = sessions
    .filter(s => s.status === "upcoming")
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastSessions = sessions
    .filter(s => s.status === "completed")
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">
            Session <span className="text-pink-600">Scheduler</span>
          </h1>
          <p className="text-xl text-gray-600">
            Book and manage meetings with {partnerName}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {getCurrentMonth()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day labels */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {getDaysInMonth().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    disabled={!date}
                    className={`
                      aspect-square p-2 rounded-lg text-center transition-all relative
                      ${!date ? 'invisible' : ''}
                      ${isToday(date) ? 'bg-pink-100 border-2 border-pink-600 font-bold' : 'hover:bg-gray-100'}
                      ${date && selectedDate.toDateString() === date.toDateString() && !isToday(date) ? 'bg-coral-100' : ''}
                      ${hasSession(date) ? 'ring-2 ring-pink-600' : ''}
                    `}
                  >
                    {date && (
                      <>
                        <span className="text-gray-900">{date.getDate()}</span>
                        {hasSession(date) && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Book Session Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Book New Session
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Sessions ({upcomingSessions.length})
              </h3>
              
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <p className="text-sm text-gray-400 mt-1">Book your next meeting!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <div
                      key={session.id}
                      className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-400 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {session.type === "video" ? (
                            <Video className="w-5 h-5 text-pink-600" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-coral-500" />
                          )}
                          <span className="font-semibold text-gray-900 capitalize">
                            {session.type} Call
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Confirmed
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDate(session.date)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {session.time} • {session.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Sessions
              </h3>
              
              <div className="space-y-3">
                {pastSessions.slice(0, 3).map(session => (
                  <div
                    key={session.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        {session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-gray-600 italic">
                        "{session.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Book a Session
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date
                </label>
                <div className="px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-lg">
                  <p className="text-gray-900">{formatDate(selectedDate)}</p>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBookingType("video")}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      bookingType === "video"
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Video className={bookingType === "video" ? "text-pink-600" : "text-gray-600"} />
                    <span className="font-semibold">Video Call</span>
                  </button>
                  <button
                    onClick={() => setBookingType("chat")}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      bookingType === "chat"
                        ? "border-coral-500 bg-coral-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <MessageSquare className={bookingType === "chat" ? "text-coral-500" : "text-gray-600"} />
                    <span className="font-semibold">Chat Session</span>
                  </button>
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Duration
                </label>
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookSession}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
