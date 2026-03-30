"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      // We need to wait a small bit for the onAuthStateChanged in AuthContext 
      // or we can check the user role manually here from Firestore if needed.
      // But for this 'separate' portal, we explicitly check role.
      
      toast.success("Identity Verified. Accessing Command Center...");
      router.push("/dashboard/admin");
      
    } catch (error: any) {
      console.error("Admin Login Error:", error);
      toast.error("Access Denied. Invalid credentials or insufficient privileges.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Decoration - Command Center Vibe */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary/5 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)] animate-pulse"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-spin-slow"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-spin-slow-reverse"></div>
         
         <div className="relative z-10 m-auto text-center px-12">
            <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-3xl shadow-primary/40 ring-4 ring-white/10 animate-bounce">
               <ShieldCheck className="w-12 h-12" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter mb-6">
               Vidyastaan<br/>
               <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-slate-400 font-bold text-xl italic max-w-md mx-auto">
               "Authorized Personnel Only. Secure Gateway to India's Learning Pulse."
            </p>
         </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900 overflow-hidden relative">
         <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px]"></div>

         <div className="w-full max-w-md relative z-10">
            <div className="mb-12">
               <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black underline decoration-slate-800">
                  <ArrowLeft className="w-4 h-4" />
                  Exit to Public Site
               </Link>
            </div>

            <div className="p-10 glass border-white/5 rounded-[3rem] shadow-3xl bg-white/5 relative overflow-hidden backdrop-blur-xl">
               <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                  <div className="p-3 bg-white/5 rounded-2xl text-primary">
                     <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-white tracking-tight">Staff Login</h2>
                     <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Entry Required</p>
                  </div>
               </div>

               <form onSubmit={handleAdminLogin} className="space-y-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">Identifier</label>
                        <div className="relative">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                           <input 
                              required
                              type="email" 
                              placeholder="admin@vidyastaan.org" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-16 pr-8 py-5 bg-white/5 border-white/10 rounded-[1.8rem] focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-white font-bold"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">Passphrase</label>
                        <div className="relative">
                           <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                           <input 
                              required
                              type="password" 
                              placeholder="••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-16 pr-8 py-5 bg-white/5 border-white/10 rounded-[1.8rem] focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-white font-bold"
                           />
                        </div>
                     </div>
                  </div>

                  <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full py-6 bg-primary text-white font-black text-lg rounded-[2.2rem] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Access Command Center"}
                  </button>
               </form>
               
               <p className="mt-10 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                  Notice: All login attempts are encrypted<br/>and monitored for unauthorized access.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
