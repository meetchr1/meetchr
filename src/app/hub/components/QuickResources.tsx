"use client";

import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Heart,
  FileText,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  bg: string;
  tag: string;
}

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "First-Year Survival Guide",
    description: "Essential tips for thriving in your first classroom",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    tag: "Guide",
  },
  {
    id: "2",
    title: "Classroom Management 101",
    description: "Practical strategies that actually work",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    tag: "Article",
  },
  {
    id: "3",
    title: "Lesson Plan Templates",
    description: "Ready-to-use templates for any subject",
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-50",
    tag: "Template",
  },
  {
    id: "4",
    title: "Dealing with Burnout",
    description: "Self-care practices for educators",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    tag: "Wellness",
  },
  {
    id: "5",
    title: "Creative Engagement Ideas",
    description: "Fun activities to keep students hooked",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    tag: "Ideas",
  },
];

export function QuickResources() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-coral-100 to-pink-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-coral-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Quick Resources
          </h3>
          <p className="text-[11px] text-gray-500">
            Curated just for you
          </p>
        </div>
      </div>

      {/* Resource list */}
      <div className="p-2">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;
          return (
            <button
              key={resource.id}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
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
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-pink-400 transition-colors shrink-0" />
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {resource.description}
                </p>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap mt-1">
                {resource.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
