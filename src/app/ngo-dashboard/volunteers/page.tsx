"use client";

import React, { useState } from "react";
import { UserCheck, Plus, Pencil, Trash2, Search, GraduationCap } from "lucide-react";
import { mockVolunteers } from "@/lib/ngoMockData";

export default function VolunteersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVolunteers = mockVolunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
               <UserCheck className="w-8 h-8 text-primary" />
               Volunteer Network
            </h1>
            <p className="text-slate-500 font-bold mt-2">Manage your teaching staff and domain experts.</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5" />
            Recruit Volunteer
         </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by name or skills..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                     <th className="p-6 whitespace-nowrap">Volunteer Name</th>
                     <th className="p-6 whitespace-nowrap">Teaching Skills</th>
                     <th className="p-6 whitespace-nowrap">Status</th>
                     <th className="p-6 whitespace-nowrap text-center">Assigned Students</th>
                     <th className="p-6 text-right whitespace-nowrap">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredVolunteers.map((volunteer) => (
                     <tr key={volunteer.uid} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg border border-emerald-100">
                                 {volunteer.name[0]}
                              </div>
                              <span className="font-bold text-slate-800">{volunteer.name}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-wrap gap-2">
                              {volunteer.subjects?.map((skill: string) => (
                                 <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3 opacity-50" />
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                              volunteer.status === "Available" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-blue-50 text-blue-600 border border-blue-100"
                           }`}>
                              {volunteer.status}
                           </span>
                        </td>
                        <td className="p-6 text-center">
                           <span className="font-black text-slate-800 text-lg">
                              {volunteer.studentsAssigned?.length || 0}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                                 <Pencil className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredVolunteers.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-16 border-t border-slate-100 text-center text-slate-400 font-bold italic">
                           No volunteers matched your search criteria.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
