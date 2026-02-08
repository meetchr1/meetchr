"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Download,
  MoreHorizontal,
  Paperclip,
  FolderOpen,
} from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  type: "doc" | "image" | "pdf" | "sheet";
  sharedBy: "me" | "partner";
  date: string;
  size: string;
}

const PLACEHOLDER_FILES: SharedFile[] = [
  {
    id: "1",
    name: "Fraction Lesson Plan - Week 12.docx",
    type: "doc",
    sharedBy: "partner",
    date: "Today",
    size: "245 KB",
  },
  {
    id: "2",
    name: "Group Role Cards Template.pdf",
    type: "pdf",
    sharedBy: "partner",
    date: "Yesterday",
    size: "1.2 MB",
  },
  {
    id: "3",
    name: "Student Engagement Tracker.xlsx",
    type: "sheet",
    sharedBy: "me",
    date: "Mon",
    size: "89 KB",
  },
  {
    id: "4",
    name: "Classroom Layout Idea.png",
    type: "image",
    sharedBy: "partner",
    date: "Last week",
    size: "3.4 MB",
  },
  {
    id: "5",
    name: "Differentiation Strategies Guide.pdf",
    type: "pdf",
    sharedBy: "me",
    date: "Last week",
    size: "2.1 MB",
  },
];

const FILE_ICONS: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  doc:   { icon: FileText,  color: "text-blue-600",   bg: "bg-blue-50" },
  pdf:   { icon: FileText,  color: "text-red-500",    bg: "bg-red-50" },
  sheet: { icon: FileText,  color: "text-emerald-600", bg: "bg-emerald-50" },
  image: { icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-50" },
};

export function SharedFiles() {
  const [files] = useState<SharedFile[]>(PLACEHOLDER_FILES);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Shared Files
            </h3>
            <p className="text-xs text-gray-500">
              {files.length} files shared between you two
            </p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
      </div>

      {/* Drop zone hint */}
      <div className="mx-4 mt-3 mb-1 p-3 border-2 border-dashed border-pink-200 rounded-xl bg-pink-50/30 text-center">
        <Paperclip className="w-4 h-4 text-pink-400 mx-auto mb-1" />
        <p className="text-xs text-pink-500">
          Drag files here or click Upload
        </p>
      </div>

      {/* File List */}
      <div className="p-2">
        {files.map((file) => {
          const fileStyle = FILE_ICONS[file.type] || FILE_ICONS.doc;
          const Icon = fileStyle.icon;

          return (
            <div
              key={file.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div
                className={`w-9 h-9 ${fileStyle.bg} rounded-lg flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${fileStyle.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {file.sharedBy === "me" ? "You" : "Your Mentor"} &middot;{" "}
                  {file.date} &middot; {file.size}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
