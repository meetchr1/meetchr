"use client";

import { useState } from "react";
import { Upload, FileText, Download, Trash2, Eye, File, Image as ImageIcon, FileSpreadsheet } from "lucide-react";

interface WorkspaceProps {
  userName: string;
  partnerName: string;
}

interface FileItem {
  id: number;
  name: string;
  type: "document" | "image" | "spreadsheet" | "other";
  size: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export function Workspace({ userName, partnerName }: WorkspaceProps) {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Lesson_Plan_Fractions.pdf", type: "document", size: "2.4 MB", uploadedBy: partnerName, uploadedAt: new Date(Date.now() - 86400000 * 2) },
    { id: 2, name: "Classroom_Management_Tips.docx", type: "document", size: "856 KB", uploadedBy: partnerName, uploadedAt: new Date(Date.now() - 86400000 * 5) },
    { id: 3, name: "Student_Progress_Tracker.xlsx", type: "spreadsheet", size: "1.2 MB", uploadedBy: userName, uploadedAt: new Date(Date.now() - 86400000 * 1) },
    { id: 4, name: "Bulletin_Board_Ideas.jpg", type: "image", size: "3.8 MB", uploadedBy: partnerName, uploadedAt: new Date(Date.now() - 86400000 * 7) }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const newFile: FileItem = { id: files.length + 1, name: "New_File.pdf", type: "document", size: "1.5 MB", uploadedBy: userName, uploadedAt: new Date() };
    setFiles([newFile, ...files]);
  };

  const handleFileSelect = () => {
    const newFile: FileItem = { id: files.length + 1, name: "Uploaded_Document.pdf", type: "document", size: "2.1 MB", uploadedBy: userName, uploadedAt: new Date() };
    setFiles([newFile, ...files]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-8 h-8 text-blue-500" />;
      case "image": return <ImageIcon className="w-8 h-8 text-green-500" />;
      case "spreadsheet": return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const diffDays = Math.ceil(Math.abs(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8"><h1 className="text-4xl mb-2">Shared <span className="text-pink-600">Workspace</span></h1><p className="text-xl text-gray-600">Collaborate and share files with {partnerName}</p></div>
        <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`bg-white rounded-2xl shadow-lg p-12 mb-8 border-2 border-dashed transition-all ${isDragging ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-400"}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-4"><Upload className="w-10 h-10 text-pink-600" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{isDragging ? "Drop your files here" : "Upload Files"}</h3>
            <p className="text-gray-600 mb-6">Drag and drop files here, or click to browse</p>
            <label className="inline-block"><input type="file" className="hidden" onChange={handleFileSelect} multiple /><span className="px-8 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"><Upload className="w-5 h-5" /> Choose Files</span></label>
            <p className="text-sm text-gray-500 mt-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200"><h2 className="text-2xl font-semibold text-gray-900">Shared Files ({files.length})</h2></div>
          {files.length === 0 ? (
            <div className="p-12 text-center"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">No files uploaded yet</p></div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-600">{file.size} • Uploaded by <span className="text-pink-600 font-semibold">{file.uploadedBy === userName ? "You" : file.uploadedBy}</span> • {formatDate(file.uploadedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" title="Preview"><Eye className="w-5 h-5" /></button>
                      <button className="p-2 text-gray-600 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-all" title="Download"><Download className="w-5 h-5" /></button>
                      {file.uploadedBy === userName && <button onClick={() => setFiles(files.filter(f => f.id !== file.id))} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-5 h-5" /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 bg-gradient-to-br from-pink-50 to-coral-50 rounded-xl p-6 border-2 border-pink-200">
          <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-gray-900">Storage Used</h3><span className="text-sm text-gray-600">12.8 MB / 1 GB</span></div>
          <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-pink-600 to-coral-500 h-3 rounded-full transition-all" style={{ width: "1.28%" }}></div></div>
          <p className="text-sm text-gray-600 mt-2">Plenty of space remaining for your teaching materials!</p>
        </div>
      </div>
    </div>
  );
}
