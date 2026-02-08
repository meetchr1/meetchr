"use client";

import { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Heart,
  FileText,
  Search,
  Bookmark,
  BookmarkCheck,
  Presentation,
  Users,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  category: string;
  tag: string;
  isNew?: boolean;
  url?: string;
}

interface Category {
  key: string;
  label: string;
  icon: React.ElementType;
}

/* ── Data ───────────────────────────────────────────────────────────── */

const CATEGORIES: Category[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "management", label: "Management", icon: Shield },
  { key: "planning", label: "Lesson Planning", icon: FileText },
  { key: "wellness", label: "Wellness", icon: Heart },
  { key: "engagement", label: "Engagement", icon: Lightbulb },
  { key: "professional", label: "Pro Dev", icon: GraduationCap },
];

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "First-Year Survival Guide",
    description: "Essential tips for thriving in your first classroom, from setup to routines",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    category: "professional",
    tag: "Guide",
    isNew: false,
  },
  {
    id: "2",
    title: "Classroom Management 101",
    description: "Practical strategies for building a positive, well-managed classroom",
    icon: Shield,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    category: "management",
    tag: "Article",
  },
  {
    id: "3",
    title: "Lesson Plan Templates",
    description: "Ready-to-use templates for any subject and grade level",
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-50",
    category: "planning",
    tag: "Template",
  },
  {
    id: "4",
    title: "Dealing with Burnout",
    description: "Self-care practices and boundary-setting for educators",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    category: "wellness",
    tag: "Wellness",
  },
  {
    id: "5",
    title: "Creative Engagement Ideas",
    description: "Fun, research-backed activities to keep students hooked and learning",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    category: "engagement",
    tag: "Ideas",
    isNew: true,
  },
  {
    id: "6",
    title: "Differentiation Strategies",
    description: "How to reach every learner in a mixed-ability classroom",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    category: "planning",
    tag: "Guide",
    isNew: true,
  },
  {
    id: "7",
    title: "Mindfulness in the Classroom",
    description: "Quick mindfulness exercises for both teachers and students",
    icon: Brain,
    color: "text-teal-600",
    bg: "bg-teal-50",
    category: "wellness",
    tag: "Wellness",
  },
  {
    id: "8",
    title: "Effective Feedback Techniques",
    description: "Give feedback that students actually use to improve",
    icon: Presentation,
    color: "text-orange-600",
    bg: "bg-orange-50",
    category: "professional",
    tag: "Article",
    isNew: true,
  },
  {
    id: "9",
    title: "Building Classroom Community",
    description: "Day-one activities and ongoing rituals to create belonging",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
    category: "management",
    tag: "Guide",
  },
  {
    id: "10",
    title: "Tech Tools for Teachers",
    description: "The best free & low-cost tools for lesson planning, grading, and communication",
    icon: Lightbulb,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    category: "engagement",
    tag: "Tools",
  },
  {
    id: "11",
    title: "Observation Prep Checklist",
    description: "Everything you need to feel confident before an admin walkthrough",
    icon: GraduationCap,
    color: "text-violet-600",
    bg: "bg-violet-50",
    category: "professional",
    tag: "Checklist",
  },
  {
    id: "12",
    title: "Parent Communication Templates",
    description: "Email templates for common parent interactions \u2014 positive and tough",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    category: "management",
    tag: "Template",
    isNew: true,
  },
];

/* ── Component ──────────────────────────────────────────────────────── */

export function ResourceLibrary() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(["1", "4"]));
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = RESOURCES.filter((r) => {
    if (showBookmarksOnly && !bookmarks.has(r.id)) return false;
    if (activeCategory !== "all" && r.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-coral-100 to-pink-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-coral-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">
            Resource Library
          </h3>
          <p className="text-[11px] text-gray-500">
            {RESOURCES.length} resources &middot; {bookmarks.size} saved
          </p>
        </div>
        <button
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`p-1.5 rounded-lg transition-colors ${
            showBookmarksOnly
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-500 hover:bg-pink-50"
          }`}
          title={showBookmarksOnly ? "Show all" : "Show saved only"}
        >
          {showBookmarksOnly ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-3 pt-3 flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-pink-50 text-pink-600 ring-1 ring-pink-200"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Resource List */}
      <div className="p-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No resources found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different search or category
            </p>
          </div>
        ) : (
          filtered.map((resource) => {
            const Icon = resource.icon;
            const isSaved = bookmarks.has(resource.id);

            return (
              <div
                key={resource.id}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className={`w-9 h-9 ${resource.bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon className={`w-4 h-4 ${resource.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-pink-600 transition-colors truncate">
                      {resource.title}
                    </p>
                    {resource.isNew && (
                      <span className="text-[9px] font-bold text-white bg-gradient-to-r from-pink-500 to-coral-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {resource.tag}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className={`p-1 rounded-lg transition-colors ${
                      isSaved
                        ? "text-pink-500 hover:bg-pink-50"
                        : "text-gray-300 hover:text-pink-400 hover:bg-pink-50"
                    }`}
                    title={isSaved ? "Remove bookmark" : "Bookmark"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    className="p-1 text-gray-300 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                    title="Open resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
