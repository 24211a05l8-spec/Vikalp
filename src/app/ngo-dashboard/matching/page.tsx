"use client";

import React from "react";
import { Award, Zap, ChevronRight, UserCircle2, CheckCircle2 } from "lucide-react";
import { mockStudents, mockVolunteers } from "@/lib/ngoMockData";
import { rankVolunteers, StudentMatchData, VolunteerMatchData } from "@/lib/matchingUtils";

export default function NgoMatchingDashboard() {
  
  // Format the mock data into the format expected by our utility
  const formatStudent = (s: any): StudentMatchData => ({ name: s.name, interests: s.subjects || [] });
  const formatVolunteers = (): VolunteerMatchData[] => mockVolunteers.map(v => ({ name: v.name, skills: v.subjects || [] }));

  // We only want to match students who are actively looking for a match or we can show all of them.
  // For the demo, let's show all pending or active students
  const studentsNeedingMatch = mockStudents.filter(s => s.status === "Pending Match" || Math.random() > 0.5);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] shadow-lg shadow-indigo-500/20 text-white">
         <div className="max-w-2xl">
            <h1 className="text-3xl font-black flex items-center gap-3">
               <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
               Smart Match Engine
            </h1>
            <p className="font-bold mt-2 opacity-90 text-sm leading-relaxed">
               Our algorithm compares active student interests against your entire volunteer skill database. Review the calculated scores and instantly assign mentors to students in need.
            </p>
         </div>
         <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{studentsNeedingMatch.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Pending</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-300">{mockVolunteers.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Mentors</p>
            </div>
         </div>
      </div>

      {/* Matching Feeds */}
      <div className="grid gap-8">
         {studentsNeedingMatch.map(student => {
            const matches = rankVolunteers(formatStudent(student), formatVolunteers());
            const topMatch = matches.length > 0 ? matches[0] : null;

            return (
               <div key={student.uid} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                     
                     {/* Student Needs Column */}
                     <div className="w-full lg:w-1/3 space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                              <UserCircle2 className="w-7 h-7 text-slate-400" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-slate-800">{student.name}</h3>
                              <p className="text-xs font-bold text-slate-400">{student.grade} • {student.school}</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Needs Help With</p>
                           <div className="flex flex-wrap gap-2">
                              {student.subjects?.map((interest: string) => (
                                 <span key={interest} className="px-3 py-1.5 bg-indigo-50 text-primary rounded-xl text-xs font-black border border-indigo-100">
                                    {interest}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Arrow Divider */}
                     <div className="hidden lg:flex items-center justify-center self-stretch opacity-20 group-hover:opacity-100 transition-opacity">
                        <div className="w-full h-px bg-slate-200 absolute max-w-[50px]"></div>
                        <ChevronRight className="w-8 h-8 text-primary relative bg-white" />
                     </div>

                     {/* Volunteer Matches Wrapper */}
                     <div className="flex-1 w-full space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Algorithm Recommendations</p>
                        
                        {matches.length === 0 ? (
                           <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500 font-bold text-sm">
                              No volunteers possess the required skills.
                           </div>
                        ) : (
                           <div className="grid gap-3">
                              {matches.slice(0, 3).map((match, idx) => {
                                 const isTop = idx === 0 && match.score > 0;
                                 return (
                                    <div key={match.name} className={`flex items-center justify-between p-4 rounded-2xl border ${isTop ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"}`}>
                                       <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isTop ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-slate-50 text-slate-500 border border-slate-200"}`}>
                                             {match.score}
                                          </div>
                                          <div>
                                             <div className="flex items-center gap-2">
                                                <p className={`font-black ${isTop ? "text-emerald-900" : "text-slate-700"}`}>{match.name}</p>
                                                {isTop && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                             </div>
                                             <p className="text-xs font-bold text-slate-400 mt-0.5">Teaches: {match.skills.join(", ")}</p>
                                          </div>
                                       </div>
                                       <button className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isTop ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" : "bg-slate-100 hover:bg-primary hover:text-white text-slate-500"}`}>
                                          Assign
                                       </button>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
}
