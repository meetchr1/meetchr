"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, X, Save, Video, MessageSquare, Search } from "lucide-react";

interface NotesProps {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
}

interface Note {
  id: number;
  sessionDate: Date;
  sessionType: "video" | "chat";
  duration: number;
  topics: string[];
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  createdAt: Date;
  lastEdited?: Date;
}

export function Notes({ userName, partnerName, userType }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      sessionDate: new Date(Date.now() - 86400000 * 2),
      sessionType: "video",
      duration: 30,
      topics: ["Classroom Management", "Student Behavior"],
      summary: "Discussed strategies for managing disruptive behavior in the classroom. Mike shared his approach to positive reinforcement and how to establish clear expectations early in the year. We practiced different redirection techniques.",
      keyTakeaways: [
        "Use positive reinforcement more frequently",
        "Establish clear classroom rules on day one",
        "Create a behavior chart system",
        "Stay calm and consistent with consequences"
      ],
      actionItems: [
        "Implement a reward system by next week",
        "Create a visual reminder chart for classroom rules",
        "Practice redirection phrases in the mirror"
      ],
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: 2,
      sessionDate: new Date(Date.now() - 86400000 * 9),
      sessionType: "video",
      duration: 45,
      topics: ["Lesson Planning", "Student Engagement"],
      summary: "Reviewed my upcoming lesson plans for the math unit on fractions. Mike suggested incorporating more hands-on activities and group work to keep students engaged. We also discussed how to differentiate instruction for students at different levels.",
      keyTakeaways: [
        "Use manipulatives to make abstract concepts concrete",
        "Break lessons into smaller chunks with check-ins",
        "Plan for multiple entry points in each lesson",
        "Build in movement and collaboration opportunities"
      ],
      actionItems: [
        "Revise fraction lesson to include pizza manipulatives",
        "Create tiered activities for different skill levels",
        "Schedule check-in with struggling students"
      ],
      createdAt: new Date(Date.now() - 86400000 * 9),
      lastEdited: new Date(Date.now() - 86400000 * 8)
    },
    {
      id: 3,
      sessionDate: new Date(Date.now() - 86400000 * 16),
      sessionType: "video",
      duration: 60,
      topics: ["Parent Communication", "Difficult Conversations"],
      summary: "Talked through how to handle upcoming parent-teacher conferences, especially with parents of struggling students. Mike role-played difficult conversation scenarios and shared his 'sandwich method' for delivering constructive feedback.",
      keyTakeaways: [
        "Start with positives, discuss concerns, end with positives",
        "Have specific examples and data ready",
        "Listen more than you talk",
        "Approach as a partnership, not a lecture"
      ],
      actionItems: [
        "Prepare conference notes for each student",
        "Gather work samples showing progress",
        "Draft talking points for challenging conversations"
      ],
      createdAt: new Date(Date.now() - 86400000 * 16)
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  
  const [newNote, setNewNote] = useState<Partial<Note>>({
    sessionType: "video",
    topics: [],
    keyTakeaways: [],
    actionItems: []
  });

  const [tempTopic, setTempTopic] = useState("");
  const [tempTakeaway, setTempTakeaway] = useState("");
  const [tempActionItem, setTempActionItem] = useState("");

  const handleAddTopic = () => {
    if (tempTopic.trim()) {
      setNewNote({
        ...newNote,
        topics: [...(newNote.topics || []), tempTopic.trim()]
      });
      setTempTopic("");
    }
  };

  const handleAddTakeaway = () => {
    if (tempTakeaway.trim()) {
      setNewNote({
        ...newNote,
        keyTakeaways: [...(newNote.keyTakeaways || []), tempTakeaway.trim()]
      });
      setTempTakeaway("");
    }
  };

  const handleAddActionItem = () => {
    if (tempActionItem.trim()) {
      setNewNote({
        ...newNote,
        actionItems: [...(newNote.actionItems || []), tempActionItem.trim()]
      });
      setTempActionItem("");
    }
  };

  const handleCreateNote = () => {
    if (!newNote.summary) return;

    const note: Note = {
      id: notes.length + 1,
      sessionDate: new Date(),
      sessionType: newNote.sessionType || "video",
      duration: 30,
      topics: newNote.topics || [],
      summary: newNote.summary || "",
      keyTakeaways: newNote.keyTakeaways || [],
      actionItems: newNote.actionItems || [],
      createdAt: new Date()
    };

    setNotes([note, ...notes]);
    setShowNewNoteModal(false);
    setNewNote({
      sessionType: "video",
      topics: [],
      keyTakeaways: [],
      actionItems: []
    });
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(note =>
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    note.keyTakeaways.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">
            Session <span className="text-pink-600">Notes</span>
          </h1>
          <p className="text-xl text-gray-600">
            Document your learning and track key insights from meetings with {partnerName}
          </p>
        </div>

        {/* Search and New Note */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowNewNoteModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-50 to-coral-50 rounded-xl p-6 border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-pink-600" />
              <h3 className="font-semibold text-gray-900">Total Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-pink-600">{notes.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Video Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {notes.filter(n => n.sessionType === "video").length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Chat Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {notes.filter(n => n.sessionType === "chat").length}
            </p>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-6">
          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No notes found" : "No session notes yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? "Try adjusting your search query"
                  : "Start documenting your mentorship sessions!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewNoteModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow-md border-2 border-transparent hover:border-pink-200 transition-all p-6"
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${note.sessionType === "video" ? "bg-purple-100" : "bg-green-100"}`}>
                        {note.sessionType === "video" ? (
                          <Video className={`w-5 h-5 ${note.sessionType === "video" ? "text-purple-600" : "text-green-600"}`} />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatDate(note.sessionDate)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {note.duration} minute session
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Topics */}
                {note.topics.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {note.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-coral-100 text-coral-600 rounded-full text-sm font-semibold"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Summary</h4>
                  <p className="text-gray-700 leading-relaxed">{note.summary}</p>
                </div>

                {/* Key Takeaways */}
                {note.keyTakeaways.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                    <ul className="space-y-2">
                      {note.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-pink-600 mt-1">&bull;</span>
                          <span className="text-gray-700">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {note.actionItems.length > 0 && (
                  <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>Action Items</span>
                    </h4>
                    <ul className="space-y-2">
                      {note.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 mt-0.5"
                          />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                {note.lastEdited && (
                  <p className="text-xs text-gray-400 mt-4">
                    Last edited {note.lastEdited.toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Create Session Note
              </h3>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Session Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewNote({...newNote, sessionType: "video"})}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      newNote.sessionType === "video"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Video className={newNote.sessionType === "video" ? "text-purple-600" : "text-gray-600"} />
                    <span className="font-semibold">Video Call</span>
                  </button>
                  <button
                    onClick={() => setNewNote({...newNote, sessionType: "chat"})}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      newNote.sessionType === "chat"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <MessageSquare className={newNote.sessionType === "chat" ? "text-green-600" : "text-gray-600"} />
                    <span className="font-semibold">Chat Session</span>
                  </button>
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Topics Discussed
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempTopic}
                    onChange={(e) => setTempTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    placeholder="Add a topic..."
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newNote.topics?.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-coral-100 text-coral-600 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      {topic}
                      <button
                        onClick={() => setNewNote({
                          ...newNote,
                          topics: newNote.topics?.filter((_, i) => i !== idx)
                        })}
                        className="hover:text-coral-800"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Session Summary *
                </label>
                <textarea
                  value={newNote.summary || ""}
                  onChange={(e) => setNewNote({...newNote, summary: e.target.value})}
                  placeholder="What did you discuss in this session?"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Key Takeaways
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempTakeaway}
                    onChange={(e) => setTempTakeaway(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
                    placeholder="Add a key takeaway..."
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTakeaway}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {newNote.keyTakeaways?.map((takeaway, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700">{takeaway}</span>
                      <button
                        onClick={() => setNewNote({
                          ...newNote,
                          keyTakeaways: newNote.keyTakeaways?.filter((_, i) => i !== idx)
                        })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Action Items
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempActionItem}
                    onChange={(e) => setTempActionItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddActionItem()}
                    placeholder="Add an action item..."
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddActionItem}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  {newNote.actionItems?.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <span className="text-gray-700">{item}</span>
                      <button
                        onClick={() => setNewNote({
                          ...newNote,
                          actionItems: newNote.actionItems?.filter((_, i) => i !== idx)
                        })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newNote.summary}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
