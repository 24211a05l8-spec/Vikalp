"use client";

import React, { useState } from "react";
import { Users, Plus, Pencil, Trash2, Search } from "lucide-react";
import { mockStudents } from "@/lib/ngoMockData";

export default function StudentsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
               <Users className="w-8 h-8 text-primary" />
               Student Directory
            </h1>
            <p className="text-slate-500 font-bold mt-2">Manage beneficiaries and their learning interests.</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5" />
            Add Student
         </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search students or schools..." 
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
                     <th className="p-6 whitespace-nowrap">Student Name</th>
                     <th className="p-6 whitespace-nowrap">Grade & School</th>
                     <th className="p-6 whitespace-nowrap">Interests</th>
                     <th className="p-6 whitespace-nowrap">Status</th>
                     <th className="p-6 text-right whitespace-nowrap">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                     <tr key={student.uid} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary flex items-center justify-center font-black text-lg">
                                 {student.name[0]}
                              </div>
                              <span className="font-bold text-slate-800">{student.name}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="font-bold text-slate-800">{student.grade}</p>
                           <p className="text-sm font-medium text-slate-400">{student.school}</p>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-wrap gap-2">
                              {student.subjects?.map((interest: string) => (
                                 <span key={interest} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                    {interest}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                              student.status === "Active" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                           }`}>
                              {student.status}
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
                  {filteredStudents.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-16 border-t border-slate-100 text-center text-slate-400 font-bold italic">
                           No students matched your search criteria.
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
