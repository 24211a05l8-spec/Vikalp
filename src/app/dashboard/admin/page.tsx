"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, Calendar, Wrench, ShieldCheck, 
  ArrowRight, TrendingUp, AlertCircle, Clock, 
  CheckCircle2, Share2, BarChart3, Search, Loader2, Sparkles, UserPlus, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getGlobalStats, getUnassignedStudents } from "@/lib/db";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [globalStats, unassigned] = await Promise.all([
          getGlobalStats(),
          getUnassignedStudents()
        ]);
        setStats(globalStats);
        setUnassignedCount(unassigned.length);
      } catch (error) {
        console.error("Admin dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const GLOBAL_STATS = [
    { label: "Total Students", value: stats?.studentCount?.toLocaleString() || "0", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", glow: "shadow-indigo-500/10" },
    { label: "Active Volunteers", value: stats?.volunteerCount?.toLocaleString() || "0", icon: UserPlus, color: "text-cyan-600", bg: "bg-cyan-50", glow: "shadow-cyan-500/10" },
    { label: "Total Sessions", value: stats?.sessionCount?.toLocaleString() || "0", icon: Calendar, color: "text-rose-600", bg: "bg-rose-50", glow: "shadow-rose-500/10" },
    { label: "Pending Apps", value: stats?.pendingAppCount?.toLocaleString() || "0", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50", glow: "shadow-amber-500/10" },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Premium Admin Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-12 glass rounded-[3.5rem] border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
             <div className="p-3 bg-primary text-white rounded-2xl shadow-lg ring-4 ring-white">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
               Command <span className="text-primary">Center</span>
             </h1>
          </div>
          <p className="text-foreground/50 font-bold text-lg italic max-w-xl">
             Vidyastaan Real-time Pulse • Monitoring India's learning network.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
           <button className="px-8 py-4 glass bg-white/40 border-white/60 rounded-[1.8rem] text-foreground/60 font-black flex items-center gap-3 hover:bg-white/60 hover:scale-105 transition-all shadow-sm">
              <BarChart3 className="w-5 h-5" />
              Impact Report
           </button>
           <Link href="/dashboard/admin/manage-admins" className="px-8 py-4 glass bg-primary/10 border-primary/20 rounded-[1.8rem] text-primary font-black flex items-center gap-3 hover:bg-primary/20 hover:scale-105 transition-all shadow-md">
              <Users className="w-5 h-5" />
              Manage Admins
           </Link>
           <Link href="/dashboard/admin/volunteers" className="px-8 py-4 bg-primary text-white rounded-[1.8rem] font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              Review Pendings
              <ArrowRight className="w-5 h-5" />
           </Link>
        </div>
      </header>

      {/* Global Pulse Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {GLOBAL_STATS.map((stat, idx) => (
          <div key={idx} className={cn(
            "p-10 glass rounded-[3rem] border-white/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group",
            stat.glow
          )}>
             <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-12", stat.bg)}>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
             </div>
             <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black tracking-tighter text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Main Activity Flow (Left) */}
         <div className="lg:col-span-2 space-y-12">
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-indigo-500/10 rounded-2xl">
                        <Activity className="w-8 h-8 text-indigo-500" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black tracking-tight">System Logs</h2>
                        <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest">Live Updates</p>
                     </div>
                  </div>
                  <button className="glass px-6 py-3 rounded-2xl text-primary font-black hover:bg-white transition-all text-sm">Full History</button>
               </div>

               <div className="space-y-4">
                  {[
                    { id: "1", type: "app", title: "New Volunteer Applied", name: "Rahul Sharma", time: "2 min ago", color: "text-rose-500", bg: "bg-rose-50" },
                    { id: "2", type: "match", title: "Match Confirmed", name: "Ananya I. matched with Sneha M.", time: "1 hour ago", color: "text-cyan-600", bg: "bg-cyan-50" },
                  ].map((activity) => (
                    <div key={activity.id} className="group relative p-8 glass rounded-[2.5rem] border-white/60 hover:-translate-y-2 transition-all duration-500 shadow-xl flex items-center justify-between overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       
                       <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all group-hover:rotate-12",
                            activity.bg, activity.color
                          )}>
                             {activity.type === "app" ? <ShieldCheck className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                          </div>
                          <div>
                             <h4 className="font-black text-xl mb-1 group-hover:text-primary transition-colors">{activity.title}</h4>
                             <p className="text-sm font-bold text-foreground/40">{activity.name} • <span className="text-primary/60 italic">{activity.time}</span></p>
                          </div>
                       </div>
                       <div className="w-12 h-12 glass bg-white/40 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                          <ArrowRight className="w-6 h-6" />
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Growth Visualization Card */}
            <section className="p-12 glass border-white/60 rounded-[3rem] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-center items-center text-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               
               <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 animate-bounce transition-transform group-hover:scale-110">
                  <TrendingUp className="w-12 h-12" />
               </div>
               <h3 className="text-3xl font-black mb-4 tracking-tighter">Growth Visualization</h3>
               <p className="text-foreground/45 font-bold text-lg max-w-sm leading-relaxed mb-10 italic">
                  "Active mentorship sessions have surged 12% this week. Our network is expanding rapidly."
               </p>
               <div className="flex gap-4">
                  <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                  <div className="h-1.5 w-24 bg-primary/20 rounded-full"></div>
                  <div className="h-1.5 w-8 bg-primary/10 rounded-full"></div>
               </div>
            </section>
         </div>

         {/* Admin Sidebars (Right) */}
         <div className="space-y-12">
            <section className="p-10 glass border-2 border-rose-100 rounded-[3rem] shadow-2xl shadow-rose-500/5 bg-rose-50/10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-rose-500 rounded-2xl shadow-lg ring-4 ring-white shadow-rose-500/20">
                     <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-rose-600">Priority Alerts</h2>
               </div>
               
               <div className="space-y-5">
                  {[
                    { id: "1", name: "Rahul K.", grade: "Grade 10", reason: "Missed 3 sessions" },
                    { id: "2", name: "Sneha M.", grade: "Grade 8", reason: "Low progress scores" },
                  ].map((s) => (
                    <div key={s.id} className="p-5 bg-white rounded-2xl border border-rose-100 flex items-center justify-between hover:scale-105 transition-transform shadow-sm">
                       <div>
                          <p className="font-black text-sm text-foreground/80">{s.name}</p>
                          <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest">{s.grade} • {s.reason}</p>
                       </div>
                       <button className="w-8 h-8 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors">
                          <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-5 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 uppercase tracking-widest">
                  At-Risk Report
                  <Sparkles className="w-4 h-4 fill-white" />
               </button>
            </section>

            <section className="p-10 glass border-cyan-100 rounded-[3.5rem] shadow-2xl shadow-cyan-500/5 relative overflow-hidden bg-cyan-50/5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5"></div>
                
                <div className="relative z-10 text-center">
                   <div className="w-20 h-20 bg-cyan-100 rounded-3xl flex items-center justify-center text-cyan-600 mx-auto mb-8 shadow-inner ring-4 ring-white">
                      <Share2 className="w-10 h-10" />
                   </div>
                   <div className="text-6xl font-black text-cyan-600 mb-2 tracking-tighter antialiased tabular-nums">{unassignedCount}</div>
                   <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.3em] mb-10">Unassigned Students</p>
                   <Link href="/dashboard/admin/assignments" className="block w-full py-5 bg-cyan-600 text-white font-black rounded-[2rem] shadow-2xl shadow-cyan-500/30 hover:bg-cyan-700 active:scale-95 transition-all text-sm uppercase tracking-widest">
                      Enter Matchmaker
                   </Link>
                </div>
            </section>
         </div>
      </div>
    </div>
  );
}
