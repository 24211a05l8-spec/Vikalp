"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, UserPlus, ArrowLeft, Loader2, 
  CheckCircle2, ArrowRight, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ManageAdmins() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create the user document in Firestore with 'admin' role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: fullName,
        email: email,
        role: "admin",
        createdAt: serverTimestamp(),
        permissions: ["all"],
      });

      toast.success("Admin account created successfully!");
      setEmail("");
      setPassword("");
      setFullName("");
      
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || "Failed to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 glass rounded-[3rem] border-white/60">
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard/admin" 
            className="w-12 h-12 glass bg-white/40 border-white/60 rounded-2xl flex items-center justify-center text-foreground/40 hover:text-primary hover:scale-105 transition-all shadow-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Admin <span className="text-primary text-4xl">Access</span></h1>
            <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest mt-1">Personnel Management</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-bold flex items-center gap-2 border border-indigo-100 shadow-sm">
           <ShieldAlert className="w-5 h-5" />
           High-Level Security
        </div>
      </div>

      {/* Main Grid: Create Admin Card */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="p-12 glass rounded-[4rem] border-white/60 shadow-2xl relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <UserPlus className="w-8 h-8" />
                   </div>
                   <h2 className="text-3xl font-black tracking-tight">Create <span className="text-primary italic">Admin</span></h2>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Full Name</label>
                         <input 
                            required
                            type="text" 
                            placeholder="Full Name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-8 py-5 glass border-white/60 rounded-[1.8rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 font-bold"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Email Address</label>
                         <input 
                            required
                            type="email" 
                            placeholder="admin@vidyastaan.org" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-8 py-5 glass border-white/60 rounded-[1.8rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 font-bold"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-foreground/30 px-2">Temporary Password</label>
                         <input 
                            required
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-5 glass border-white/60 rounded-[1.8rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 font-bold"
                         />
                      </div>
                   </div>

                   <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-6 bg-primary text-white font-black text-lg rounded-[2.2rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          Establish Admin Account
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="lg:col-span-2 space-y-8">
           <div className="p-10 glass border-white/60 rounded-[3rem] shadow-xl space-y-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-indigo-600">
                 <ShieldAlert className="w-6 h-6" />
                 Privilege Level
              </h3>
              <p className="text-foreground/50 font-bold leading-relaxed italic text-sm">
                 Adding a member as Admin grants them full system control, including user management, data access, and settings. Use with extreme caution.
              </p>
              <div className="flex flex-col gap-3">
                 {[
                   "Manage Volunteers", "Access Financial Data", "Modify Site Content", "System Settings"
                 ].map((item) => (
                   <div key={item} className="flex items-center gap-3 py-3 px-5 bg-white/40 rounded-2xl border border-white/60 text-xs font-bold text-foreground/60 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {item}
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-10 glass border-white/60 rounded-[3rem] shadow-xl bg-primary/5 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-inner flex items-center justify-center text-primary border border-white/60">
                 <Sparkles className="w-8 h-8" />
              </div>
              <p className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em]">Next Step</p>
              <h4 className="text-lg font-black leading-tight text-foreground max-w-[200px]">Send the set credentials to the new member.</h4>
           </div>
        </div>
      </div>
    </div>
  );
}
