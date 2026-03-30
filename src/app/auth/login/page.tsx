"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      // Determine role from email for demo/testing purposes
      let role: "student" | "volunteer" = "student";
      if (email.includes("volunteer")) role = "volunteer";

      toast.success(`Welcome back! Accessing ${role} portal...`);
      router.push(`/dashboard/${role}`);
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 sm:mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
          Login to Vidyastaan
        </h2>
        <p className="mt-2 text-center text-sm text-foreground/60">
          Or{" "}
          <Link href="/auth/register/student" className="font-medium text-primary hover:text-primary/80">
            register as a student
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-3xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/70">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground/70">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-foreground/50">Tip for testing</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3">
               <p className="text-xs text-center text-foreground/40 leading-relaxed">
                  Include "volunteer" in email for Volunteer Dashboard.<br/>
                  Include "admin" in email for Admin Dashboard.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
