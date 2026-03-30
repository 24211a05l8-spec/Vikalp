"use client";

import React from "react";
import { Users, GraduationCap, CalendarCheck, Target, Activity, TrendingUp, BookOpen, MapPin } from "lucide-react";
import { 
   ngoStats, 
   performanceData, 
   subjectDemandData, 
   impactTreeData 
} from "@/lib/ngoMockData";

// Recharts components
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Treemap
} from 'recharts';

export default function NgoDashboardOverview() {
  const cards = [
    { title: "Total Students", value: ngoStats.totalStudents, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Verified Volunteers", value: ngoStats.totalVolunteers, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Active Sessions", value: ngoStats.activeSessions, icon: CalendarCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Lessons Completed", value: ngoStats.completedLessons, icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">NGO Command Center</h1>
          <p className="text-slate-500 font-bold mt-2">Platform Impact Overview</p>
        </div>
        <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full font-black text-sm flex items-center gap-2 border border-emerald-100 shadow-sm">
           <Activity className="w-5 h-5 animate-pulse" />
           +{ngoStats.growthRate}% M/M Growth
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((kpi, idx) => (
          <div key={idx} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
             <div className={`w-16 h-16 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <kpi.icon className="w-8 h-8" />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
             <h2 className="text-4xl font-black text-slate-800 mt-2">{kpi.value.toLocaleString()}</h2>
          </div>
        ))}
      </div>

      {/* Main Line Chart: Monthly Network Growth */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-800">Registration Velocity</h3>
               <p className="text-sm font-bold text-slate-400 mt-1">Monthly progression of active network users</p>
            </div>
         </div>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontWeight: 800, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontWeight: 800, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ fontWeight: 900, color: '#1e293b' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 800 }} iconType="circle" />
                  <Line type="monotone" dataKey="students" name="Active Students" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="volunteers" name="Active Volunteers" stroke="#10b981" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Split Charts: Demand Bar Chart & Geographic Treemap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Demand Bar Chart */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">Subject Demand</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">Student requests vs Available mentors</p>
               </div>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectDemandData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#64748b', fontWeight: 800, fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Legend wrapperStyle={{ paddingTop: '10px', fontWeight: 800 }} iconType="circle" />
                     <Bar dataKey="demand" name="Student Requests" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                     <Bar dataKey="volunteers" name="Available Volunteers" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Geographic Treemap */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">Demographic Impact</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">Platform reach by municipal limits</p>
               </div>
            </div>
            {/* Treemap Container */}
            <div className="flex-1 w-full min-h-[16rem]">
               <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                     data={impactTreeData}
                     dataKey="size"
                     aspectRatio={4 / 3}
                     stroke="#fff"
                     strokeWidth={2}
                     isAnimationActive={true}
                  >
                     <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                        formatter={(value) => `${value} Students`}
                     />
                  </Treemap>
               </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
}
