"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentProgressStats } from "@/lib/db";
import {
  BookOpen,
  CheckCircle,
  Zap,
  TrendingUp,
  Award,
  Target,
  Flame,
  BarChart3,
  Sparkles,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressData {
  overallProgress: number;
  learningCount: number;
  completedCount: number;
  totalCount: number;
  subjectsTracking: Array<{ subject: string; total: number; completed: number; learning: number }>;
  recentTopics: any[];
}

export default function ProgressTracker() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchProgress() {
      try {
        const stats = await getStudentProgressStats(user!.uid);
        setProgressData(stats as ProgressData);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
    
    // Refresh every 5 seconds to catch updates from quizzes
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [user, refreshKey]);

  if (loading || !progressData) {
    return (
      <div className="space-y-6 pb-10">
        <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const { overallProgress, learningCount, completedCount, totalCount, subjectsTracking, recentTopics } = progressData;

  return (
    <div className="space-y-8 pb-10">
      {/* Overall Progress Card */}
      <div className="glass rounded-[2rem] p-8 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Learning Progress
              </h3>
              <p className="text-sm text-foreground/50 mt-1">Track your learning journey across topics</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-primary">{overallProgress}%</p>
              <p className="text-xs text-foreground/50 mt-1">Overall Progress</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{completedCount} topics completed</span>
              <span className="text-foreground/50">{totalCount} total topics</span>
            </div>
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 shadow-lg shadow-primary/30"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-white/50 rounded-xl border border-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 uppercase font-semibold">Currently Learning</p>
                  <p className="text-2xl font-black text-foreground">{learningCount}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/50 rounded-xl border border-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 uppercase font-semibold">Completed</p>
                  <p className="text-2xl font-black text-foreground">{completedCount}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/50 rounded-xl border border-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 uppercase font-semibold">Days Streak</p>
                  <p className="text-2xl font-black text-foreground">7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Progress */}
      {subjectsTracking.length > 0 && (
        <div className="glass rounded-[2rem] p-8 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Progress by Subject</h3>
          </div>

          <div className="space-y-4">
            {subjectsTracking.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {subject.subject}
                  </p>
                  <span className="text-sm text-foreground/60">
                    {subject.completed}/{subject.total} topics
                  </span>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${subject.total > 0 ? (subject.completed / subject.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Learning Topics */}
      {recentTopics.length > 0 && (
        <div className="glass rounded-[2rem] p-8 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Your Recent Learning</h3>
          </div>

          <div className="space-y-3">
            {recentTopics.map((topic) => (
              <div
                key={topic.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  topic.status === "completed"
                    ? "bg-green-50 border-green-200"
                    : "bg-blue-50 border-blue-200"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                      <p className="font-semibold text-foreground">{topic.title}</p>
                    </div>
                    <p className="text-sm text-foreground/60 mb-2">{topic.subject} • Grade {topic.grade}</p>

                    {topic.status === "learning" && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-blue-600">{topic.progress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    {topic.status === "completed" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {topic.testsAttempted && topic.testsAttempted > 0 && (
                      <p className="text-xs text-foreground/60 mt-2">
                        Avg Score: <span className="font-bold">{topic.averageScore}%</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="glass rounded-[2rem] p-12 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Start Your Learning Journey</h3>
          <p className="text-foreground/60 mb-4">
            Choose topics from Resources to begin tracking your learning progress. Your journey will be tracked here!
          </p>
        </div>
      )}
    </div>
  );
}
