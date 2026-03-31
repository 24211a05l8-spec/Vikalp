"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, Wrench, BookOpen, Bot, Award, Settings, 
  Menu, X, LogOut, ChevronRight, Sparkles, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const studentNav = [
  { name: "Home", href: "/dashboard/student", icon: Home },
  { name: "Progress Tracker", href: "/dashboard/student/progress", icon: TrendingUp },
  { name: "My Sessions", href: "/dashboard/student/sessions", icon: Calendar },
  { name: "Workshops", href: "/dashboard/student/workshops", icon: Wrench },
  { name: "Resources", href: "/dashboard/student/resources", icon: BookOpen },
  { name: "AI Study Buddy", href: "/dashboard/student/ai-buddy", icon: Bot },
  { name: "My Portfolio", href: "/dashboard/student/portfolio", icon: Award },
];

const volunteerNav = [
  { name: "Home", href: "/dashboard/volunteer", icon: Home },
  { name: "My Students", href: "/dashboard/volunteer/students", icon: Home },
  { name: "My Sessions", href: "/dashboard/volunteer/sessions", icon: Calendar },
  { name: "Workshops", href: "/dashboard/volunteer/workshops", icon: Wrench },
  { name: "AI Tools", href: "/dashboard/volunteer/ai-tools", icon: Bot },
  { name: "My Impact", href: "/dashboard/volunteer/impact", icon: Award },
];

const adminNav = [
  { name: "Overview", href: "/dashboard/admin", icon: Home },
  { name: "Students", href: "/dashboard/admin/students", icon: Home },
  { name: "Volunteers", href: "/dashboard/admin/volunteers", icon: Home },
  { name: "Assignments", href: "/dashboard/admin/assignments", icon: Home },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: Home },
];

const ngoNav = [
  { name: "Overview", href: "/ngo-dashboard", icon: Home },
  { name: "Students", href: "/ngo-dashboard/students", icon: Home },
  { name: "Volunteers", href: "/ngo-dashboard/volunteers", icon: Home },
  { name: "Match Making", href: "/ngo-dashboard/advanced-matching", icon: Award },
  { name: "Sessions", href: "/ngo-dashboard/sessions", icon: Calendar },
  { name: "Announcements", href: "/ngo-dashboard/announcements", icon: Bot },
];

export default function Sidebar({ role }: { role: "student" | "volunteer" | "admin" | "ngo" }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = role === "student" ? studentNav : role === "volunteer" ? volunteerNav : role === "admin" ? adminNav : ngoNav;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 p-5 bg-primary text-white rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-80 transition-all duration-500 ease-in-out lg:translate-x-0 border-r border-white/60",
        "bg-white/80 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.03)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
               <Sparkles className="w-6 h-6 text-white" />
            </div>
            <Link href="/" className="text-2xl font-black tracking-tight text-foreground group">
              Vidyastaan
              <span className="block h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></span>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="px-6 mb-10">
             <div className="group relative p-6 bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden transition-all hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white transition-transform group-hover:scale-110 group-hover:rotate-6">
                    {user?.name?.[0] || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black truncate text-foreground/90">{user?.name}</p>
                    <p className="text-xs text-primary font-black uppercase tracking-widest mt-0.5">{role} Access</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-black transition-all group overflow-hidden",
                    isActive 
                      ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105" 
                      : "text-foreground/50 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {/* Subtle active glow indicator */}
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-full my-4"></div>}
                  
                  <item.icon className={cn("w-6 h-6 transition-transform duration-500", isActive ? "text-white" : "text-foreground/30 group-hover:text-primary group-hover:scale-110")} />
                  <span className="tracking-tight">{item.name}</span>
                  {isActive && <ChevronRight className="w-5 h-5 ml-auto animate-pulse" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Controls */}
          <div className="p-6 border-t border-white/60 space-y-2 mt-auto">
             <Link
                href={`/dashboard/${role}/settings`}
                className="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-bold text-foreground/40 hover:bg-primary/5 hover:text-primary transition-all group"
             >
                <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                Settings
             </Link>
             <button
                onClick={() => logout()}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group"
             >
                <div className="p-2 rounded-xl group-hover:bg-rose-100 transition-colors">
                  <LogOut className="w-5 h-5" />
                </div>
                Logout
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}
