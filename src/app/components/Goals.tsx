"use client";
import { useState } from "react";
import { Target, Plus, Trash2, Check, TrendingUp, Calendar, Edit2, X } from "lucide-react";

interface GoalsProps {
  userName: string;
  partnerName: string;
  userType: "novice" | "veteran";
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: "classroom-management" | "instruction" | "student-relationships" | "professional-development" | "other";
  targetDate: Date;
  progress: number;
  status: "in-progress" | "completed" | "overdue";
  milestones: Milestone[];
  createdAt: Date;
}

interface Milestone {
  id: number;
  text: string;
  completed: boolean;
}

export function Goals({ userName, partnerName, userType }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Master Classroom Management",
      description: "Develop consistent routines and positive behavior strategies",
      category: "classroom-management",
      targetDate: new Date(Date.now() + 86400000 * 60),
      progress: 60,
      status: "in-progress",
      milestones: [
        { id: 1, text: "Create morning routine", completed: true },
        { id: 2, text: "Implement reward system", completed: true },
        { id: 3, text: "Establish clear expectations", completed: true },
        { id: 4, text: "Practice redirection techniques", completed: false },
        { id: 5, text: "Get feedback from mentor", completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 30)
    },
    {
      id: 2,
      title: "Differentiate Instruction",
      description: "Learn to meet diverse student needs in my lessons",
      category: "instruction",
      targetDate: new Date(Date.now() + 86400000 * 45),
      progress: 40,
      status: "in-progress",
      milestones: [
        { id: 1, text: "Research differentiation strategies", completed: true },
        { id: 2, text: "Create tiered assignments", completed: true },
        { id: 3, text: "Implement small group instruction", completed: false },
        { id: 4, text: "Assess student progress", completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 15)
    },
    {
      id: 3,
      title: "Build Student Relationships",
      description: "Connect with each student individually",
      category: "student-relationships",
      targetDate: new Date(Date.now() + 86400000 * 90),
      progress: 80,
      status: "in-progress",
      milestones: [
        { id: 1, text: "Learn all student names", completed: true },
        { id: 2, text: "Conduct interest surveys", completed: true },
        { id: 3, text: "Have 1-on-1 check-ins", completed: true },
        { id: 4, text: "Attend student events", completed: true },
        { id: 5, text: "Maintain communication log", completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 45)
    }
  ]);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<Goal["category"]>("classroom-management");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("");
  const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);

  const handleCreateGoal = () => {
    if (!newGoalTitle || !newGoalTargetDate) return;

    const newGoal: Goal = {
      id: goals.length + 1,
      title: newGoalTitle,
      description: newGoalDescription,
      category: newGoalCategory,
      targetDate: new Date(newGoalTargetDate),
      progress: 0,
      status: "in-progress",
      milestones: [],
      createdAt: new Date()
    };

    setGoals([newGoal, ...goals]);
    setShowNewGoalModal(false);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalCategory("classroom-management");
    setNewGoalTargetDate("");
  };

  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          status: progress === 100 ? "completed" as const : "in-progress" as const
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "classroom-management":
        return "bg-blue-100 text-blue-700";
      case "instruction":
        return "bg-purple-100 text-purple-700";
      case "student-relationships":
        return "bg-green-100 text-green-700";
      case "professional-development":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (targetDate: Date) => {
    const diff = targetDate.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const activeGoals = goals.filter(g => g.status === "in-progress");
  const completedGoals = goals.filter(g => g.status === "completed");
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">
            Goals & <span className="text-pink-600">Progress</span>
          </h1>
          <p className="text-xl text-gray-600">
            Track your teaching journey and celebrate your growth
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-50 to-coral-50 rounded-xl p-6 border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-pink-600" />
              <h3 className="font-semibold text-gray-900">Active Goals</h3>
            </div>
            <p className="text-3xl font-bold text-pink-600">{activeGoals.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedGoals.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Avg Progress</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{totalProgress}%</p>
          </div>

          <div className="bg-gradient-to-br from-coral-50 to-orange-50 rounded-xl p-6 border-2 border-coral-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-coral-500" />
              <h3 className="font-semibold text-gray-900">Total Goals</h3>
            </div>
            <p className="text-3xl font-bold text-coral-500">{goals.length}</p>
          </div>
        </div>

        {/* New Goal Button */}
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="w-full mb-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold text-lg"
        >
          <Plus className="w-6 h-6" />
          Create New Goal
        </button>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Active Goals ({activeGoals.length})
            </h2>
            <div className="space-y-4">
              {activeGoals.map(goal => (
                <div
                  key={goal.id}
                  className="bg-white rounded-xl shadow-md border-2 border-transparent hover:border-pink-200 transition-all overflow-hidden"
                >
                  {/* Goal Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {goal.title}
                          </h3>
                          <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                            {getCategoryLabel(goal.category)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{goal.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {formatDate(goal.targetDate)}
                          </span>
                          <span>
                            {getDaysRemaining(goal.targetDate)} days remaining
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-pink-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-pink-600 to-coral-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones Toggle */}
                    {goal.milestones.length > 0 && (
                      <button
                        onClick={() => setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)}
                        className="text-pink-600 hover:text-pink-700 font-semibold text-sm"
                      >
                        {expandedGoalId === goal.id ? "Hide" : "Show"} Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                      </button>
                    )}
                  </div>

                  {/* Milestones */}
                  {expandedGoalId === goal.id && goal.milestones.length > 0 && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-200 bg-gray-50">
                      <div className="pt-4 space-y-2">
                        {goal.milestones.map(milestone => (
                          <label
                            key={milestone.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-pink-50 transition-all cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={() => toggleMilestone(goal.id, milestone.id)}
                              className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                            />
                            <span className={`flex-1 ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {milestone.text}
                            </span>
                            {milestone.completed && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Completed Goals ({completedGoals.length})
            </h2>
            <div className="space-y-3">
              {completedGoals.map(goal => (
                <div
                  key={goal.id}
                  className="bg-green-50 rounded-xl p-6 border-2 border-green-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Check className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {goal.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                          {getCategoryLabel(goal.category)}
                        </span>
                      </div>
                      <p className="text-gray-600">{goal.description}</p>
                    </div>
                    <span className="text-sm text-green-700 font-semibold">
                      100% Complete
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 mb-6">
              Set your first teaching goal and start tracking your progress!
            </p>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Create New Goal
              </h3>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g., Master Classroom Management"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="What do you want to achieve?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value as Goal["category"])}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="classroom-management">Classroom Management</option>
                  <option value="instruction">Instruction</option>
                  <option value="student-relationships">Student Relationships</option>
                  <option value="professional-development">Professional Development</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Target Completion Date *
                </label>
                <input
                  type="date"
                  value={newGoalTargetDate}
                  onChange={(e) => setNewGoalTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!newGoalTitle || !newGoalTargetDate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
