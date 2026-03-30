"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogIn, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-4 px-6 md:px-12" : "py-8 px-6 md:px-20"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between p-4 px-8 rounded-[2rem] transition-all duration-700",
        scrolled 
          ? "glass-dark bg-white/70 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] border-white/60" 
          : "bg-transparent border-transparent"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110">
            <span className="font-black text-xl">V</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">Vidyastaan</span>
        </Link>

        {/* Quick Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="#how-it-works" className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors tracking-widest uppercase">How it works</Link>
          <Link href="#impact" className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors tracking-widest uppercase">Impact</Link>
          <Link href="#features" className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors tracking-widest uppercase">Features</Link>
          
          <Link href="/ngo-dashboard" className="text-sm font-black text-primary hover:text-indigo-700 transition-colors tracking-widest uppercase flex items-center gap-2 bg-primary/10 px-5 py-2.5 rounded-2xl hover:scale-105 active:scale-95">
             NGO Portal
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login" 
            className="flex items-center gap-2 text-sm font-black text-foreground/60 hover:text-primary transition-all px-6 py-3 rounded-2xl hover:bg-white/40"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link 
            href="/auth/register/student" 
            className="hidden sm:flex items-center gap-2 bg-primary text-white text-sm font-black px-8 py-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Start Free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
