"use client";

import { useState } from "react";
import { User, Mail, MapPin, GraduationCap, BookOpen, Calendar, AlertCircle, Save, Edit2, Check, X } from "lucide-react";

interface ProfileProps {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
}

export function Profile({ userName, partnerName, userType }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showRequestMatchModal, setShowRequestMatchModal] = useState(false);
  const [matchRequestReason, setMatchRequestReason] = useState("");
  const [matchRequestSubmitted, setMatchRequestSubmitted] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userType === "novice" ? "sarah.johnson@school.edu" : "mike.roberts@school.edu",
    location: "San Francisco, CA",
    school: "Lincoln Elementary School",
    gradeLevel: userType === "novice" ? "3rd Grade" : "4th Grade",
    subject: "General Education",
    yearsExperience: userType === "novice" ? "1 year" : "15 years",
    bio: userType === "novice" 
      ? "First-year teacher passionate about creating an engaging and supportive classroom environment. Eager to learn from experienced educators and grow as a professional."
      : "Veteran educator with a passion for mentoring the next generation of teachers. I specialize in classroom management and building strong student relationships.",
    teachingFocus: userType === "novice"
      ? ["Classroom Management", "Student Engagement", "Lesson Planning"]
      : ["Mentorship", "Instructional Design", "Professional Development"],
    availability: "Weekday evenings and weekends",
    preferredMeetingType: "Video calls"
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleRequestNewMatch = () => {
    if (!matchRequestReason.trim()) return;
    
    setMatchRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestMatchModal(false);
      setMatchRequestReason("");
      setMatchRequestSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl mb-2">
              My <span className="text-pink-600">Profile</span>
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account and preferences
            </p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-pink-600 to-coral-500 p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-pink-600" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{profileData.name}</h2>
                <p className="text-pink-100 text-lg">
                  {userType === "novice" ? "Novice Teacher" : "Veteran Mentor"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {profileData.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {profileData.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Teaching Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Teaching Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.school}
                      onChange={(e) => setEditData({...editData, school: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      {profileData.school}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.gradeLevel}
                      onChange={(e) => setEditData({...editData, gradeLevel: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-gray-900">{profileData.gradeLevel}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Area</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.subject}
                      onChange={(e) => setEditData({...editData, subject: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      {profileData.subject}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.yearsExperience}
                      onChange={(e) => setEditData({...editData, yearsExperience: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {profileData.yearsExperience}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            {/* Teaching Focus */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Teaching Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.teachingFocus.map((focus, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            {/* Meeting Preferences */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Meeting Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.availability}
                      onChange={(e) => setEditData({...editData, availability: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.availability}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Meeting Type</label>
                  {isEditing ? (
                    <select
                      value={editData.preferredMeetingType}
                      onChange={(e) => setEditData({...editData, preferredMeetingType: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option>Video calls</option>
                      <option>Chat sessions</option>
                      <option>Both equally</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.preferredMeetingType}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Match */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Current {userType === "novice" ? "Mentor" : "Mentee"}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{partnerName}</h4>
                <p className="text-gray-600">
                  {userType === "novice" ? "Veteran Mentor" : "Novice Teacher"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRequestMatchModal(true)}
              className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all flex items-center gap-2 font-semibold"
            >
              <AlertCircle className="w-5 h-5" />
              Request New Match
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about your mentorship</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h4 className="font-semibold text-gray-900">Session Reminders</h4>
                <p className="text-sm text-gray-600">Get reminded before scheduled sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Progress Reports</h4>
                <p className="text-sm text-gray-600">Receive weekly summaries of your progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Request New Match Modal */}
      {showRequestMatchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Request New Match
                </h3>
              </div>
              <button
                onClick={() => setShowRequestMatchModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              We&apos;re sorry to hear that your current match isn&apos;t working out. Please tell us why you&apos;d like to request a new match, and we&apos;ll work to find you a better fit.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for requesting a new match *
              </label>
              <textarea
                value={matchRequestReason}
                onChange={(e) => setMatchRequestReason(e.target.value)}
                placeholder="Please provide details about why this match isn't working..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            {matchRequestSubmitted ? (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                  <Check className="w-5 h-5" />
                  Request submitted! We&apos;ll be in touch soon.
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestMatchModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestNewMatch}
                  disabled={!matchRequestReason.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
