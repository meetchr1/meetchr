"use client";

import { useState } from "react";
import { BookOpen, Video, FileText, Link as LinkIcon, Search, Filter, Star, ExternalLink } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: "article" | "video" | "guide" | "link";
  category: string;
  url: string;
  duration?: string;
  isFavorite?: boolean;
  tags: string[];
}

const resourcesData: Resource[] = [
  { id: 1, title: "Classroom Management Strategies for New Teachers", description: "Evidence-based techniques for maintaining an engaging and productive classroom environment.", type: "article", category: "Classroom Management", url: "#", tags: ["behavior", "engagement", "routines"] },
  { id: 2, title: "Building Positive Relationships with Students", description: "Learn how to create meaningful connections that support student success and well-being.", type: "video", category: "Student Relationships", url: "#", duration: "12 min", tags: ["relationships", "social-emotional", "community"] },
  { id: 3, title: "Differentiation in the Classroom: A Complete Guide", description: "Step-by-step strategies for meeting diverse student needs in your lessons.", type: "guide", category: "Instruction", url: "#", tags: ["differentiation", "inclusion", "pedagogy"] },
  { id: 4, title: "Effective Parent Communication Templates", description: "Ready-to-use email and letter templates for various parent communication scenarios.", type: "link", category: "Communication", url: "#", tags: ["parents", "communication", "templates"] },
  { id: 5, title: "Formative Assessment Techniques That Work", description: "Quick and effective ways to check for understanding during instruction.", type: "article", category: "Assessment", url: "#", tags: ["assessment", "feedback", "data"] },
  { id: 6, title: "Setting Up Your Classroom for Success", description: "Physical environment tips and tricks from veteran educators.", type: "video", category: "Classroom Setup", url: "#", duration: "18 min", tags: ["environment", "organization", "setup"] },
  { id: 7, title: "The First Week: Daily Plans and Activities", description: "A comprehensive guide to planning and executing your first week of school.", type: "guide", category: "Getting Started", url: "#", tags: ["planning", "first-week", "routines"] },
  { id: 8, title: "Understanding Trauma-Informed Teaching", description: "How to create a safe and supportive environment for students who have experienced trauma.", type: "article", category: "Student Support", url: "#", tags: ["trauma", "support", "wellness"] },
  { id: 9, title: "Time Management for Teachers", description: "Practical strategies to balance planning, grading, and personal time.", type: "video", category: "Self-Care", url: "#", duration: "15 min", tags: ["time-management", "balance", "productivity"] },
  { id: 10, title: "Collaborative Learning Activities Library", description: "100+ tried-and-tested group activities for various subjects and grade levels.", type: "link", category: "Instruction", url: "#", tags: ["collaboration", "activities", "engagement"] },
  { id: 11, title: "Dealing with Difficult Behavior: Case Studies", description: "Real scenarios and solutions from experienced teachers.", type: "guide", category: "Classroom Management", url: "#", tags: ["behavior", "interventions", "solutions"] },
  { id: 12, title: "Creating Engaging Lesson Plans", description: "Design lessons that captivate students and maximize learning.", type: "video", category: "Instruction", url: "#", duration: "22 min", tags: ["planning", "engagement", "design"] }
];

export function ResourceLibrary() {
  const [resources, setResources] = useState(resourcesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const categories = ["All", "Classroom Management", "Instruction", "Student Relationships", "Assessment", "Communication", "Getting Started", "Student Support", "Self-Care", "Classroom Setup"];
  const types = ["All", "article", "video", "guide", "link"];

  const toggleFavorite = (id: number) => { setResources(resources.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)); };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || resource.description.toLowerCase().includes(searchQuery.toLowerCase()) || resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesType = selectedType === "All" || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => { switch (type) { case "article": return <FileText className="w-5 h-5" />; case "video": return <Video className="w-5 h-5" />; case "guide": return <BookOpen className="w-5 h-5" />; case "link": return <LinkIcon className="w-5 h-5" />; default: return <FileText className="w-5 h-5" />; } };
  const getTypeBadgeColor = (type: string) => { switch (type) { case "article": return "bg-blue-100 text-blue-700"; case "video": return "bg-purple-100 text-purple-700"; case "guide": return "bg-green-100 text-green-700"; case "link": return "bg-coral-100 text-coral-600"; default: return "bg-gray-100 text-gray-700"; } };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"><h1 className="text-4xl mb-2">Resource <span className="text-pink-600">Library</span></h1><p className="text-xl text-gray-600">Curated articles, videos, and guides to support your teaching journey</p></div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" /></div></div>
            <div className="md:col-span-1"><div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div></div>
            <div className="md:col-span-1"><select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white capitalize">{types.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}</select></div>
          </div>
          {(searchQuery || selectedCategory !== "All" || selectedType !== "All") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">Search: {searchQuery}</span>}
              {selectedCategory !== "All" && <span className="px-3 py-1 bg-coral-100 text-coral-700 rounded-full text-sm">{selectedCategory}</span>}
              {selectedType !== "All" && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">{selectedType}</span>}
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedType("All"); }} className="text-sm text-pink-600 hover:text-pink-700 font-semibold">Clear all</button>
            </div>
          )}
        </div>
        <div className="mb-4"><p className="text-gray-600">Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-200 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getTypeBadgeColor(resource.type)}`}>{getTypeIcon(resource.type)}</div>
                  <button onClick={() => toggleFavorite(resource.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><Star className={`w-5 h-5 ${resource.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} /></button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{resource.category}</span>
                  {resource.duration && <span className="text-xs text-gray-500">{resource.duration}</span>}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">{resource.tags.slice(0, 3).map((tag, idx) => <span key={idx} className="text-xs px-2 py-0.5 bg-pink-50 text-pink-600 rounded">#{tag}</span>)}</div>
                <a href={resource.url} className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all group-hover:gap-3"><span className="font-semibold">View Resource</span><ExternalLink className="w-4 h-4" /></a>
              </div>
            </div>
          ))}
        </div>
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3><p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedType("All"); }} className="px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
