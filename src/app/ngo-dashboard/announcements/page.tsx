"use client";

import React, { useState } from "react";
import { Megaphone, Plus, BellRing, Users, X, Send } from "lucide-react";
import { mockAnnouncements } from "@/lib/ngoMockData";

export default function NGOAnnouncements() {
  // Local state to hold the feed dynamically
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form input states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAudience, setNewAudience] = useState("All Users");

  // Handler to publish the broadcast
  const handlePublish = (e: React.FormEvent) => {
     e.preventDefault();
     if(!newTitle.trim()) return;

     const newBroadcast = {
        id: `a${Date.now()}`,
        title: newTitle,
        date: "Just now",
        audience: newAudience,
        description: newDesc || "No additional details provided."
     };

     // Insert string at the top of the feed
     setAnnouncements([newBroadcast, ...announcements]);
     
     // Reset and Close
     setNewTitle("");
     setNewDesc("");
     setNewAudience("All Users");
     setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
               <Megaphone className="w-8 h-8 text-rose-500" />
               Platform Announcements
            </h1>
            <p className="text-slate-500 font-bold mt-2">Broadcast updates across your network of volunteers and students.</p>
         </div>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-black rounded-2xl shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
         >
            <Plus className="w-5 h-5" />
            New Broadcast
         </button>
      </div>

      {/* Feed Column */}
      <div className="max-w-4xl space-y-6">
         {announcements.map((announcement) => (
            <div key={announcement.id} className="flex gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
               <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <BellRing className="w-8 h-8 text-rose-500 group-hover:rotate-12 transition-transform" />
               </div>
               <div className="flex-1 space-y-4">
                  <div>
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{announcement.date}</p>
                     <h2 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">
                        {announcement.title}
                     </h2>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                     <Users className="w-4 h-4 opacity-50" />
                     Sent to: <span className="text-slate-800">{announcement.audience}</span>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed">
                     {/* Safe fallback for older mock database structures */}
                     {(announcement as any).description || "This is a placeholder description for the announcement content block. Detailed descriptions, curriculum links, or Zoom meeting passwords would be securely rendered here for the target audience to digest."}
                  </p>
               </div>
            </div>
         ))}
      </div>

      {/* Broadcast Creation Modal Overlay */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
               
               {/* Modal Header */}
               <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
                        <Megaphone className="w-6 h-6" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-800">Compose Broadcast</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Push to users instantly</p>
                     </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 hover:rotate-90 transition-all">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Form Content */}
               <form onSubmit={handlePublish} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Headline</label>
                     <input 
                        type="text" 
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., Important Security Update..."
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-300 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Audience</label>
                     <select 
                        value={newAudience}
                        onChange={(e) => setNewAudience(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-300 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 appearance-none"
                     >
                        <option value="All Users">🌍 All Platform Users</option>
                        <option value="Volunteers Only">🎓 Verified Mentors Only</option>
                        <option value="Students Only">📚 Registered Students Only</option>
                        <option value="Admins">🛡 Admin Board</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Detailed Message</label>
                     <textarea 
                        rows={4}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Type exactly what you want your users to read..."
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-rose-300 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 resize-none"
                     ></textarea>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-500 hover:bg-slate-50 rounded-2xl transition-all border-2 border-transparent">
                        Cancel
                     </button>
                     <button type="submit" className="flex-[2] py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Broadcast Now
                     </button>
                  </div>
               </form>

            </div>
         </div>
      )}
    </div>
  );
}
