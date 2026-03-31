"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentProgress } from "@/lib/db";
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  Flame,
  BarChart3,
  Calendar,
  ArrowRight,
  Filter,
  Download,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LearningTopic {
  id: string;
  chapterId: string;
  title: string;
  subject: string;
  grade: number;
  status: "learning" | "completed" | "archived";
  startedAt: any;
  completedAt?: any;
  progress: number;
  notes?: string;
  testsAttempted?: number;
  testsCompleted?: number;
  averageScore?: number;
}

export default function StudentProgressPage() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "learning" | "completed" | "archived">("all");
  const [sortBy, setSortBy] = useState<"recent" | "subject" | "progress">("recent");

  useEffect(() => {
    if (!user) return;

    async function fetchProgress() {
      try {
        const progress = await getStudentProgress(user!.uid);
        setProgressData(progress);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
    
    // Auto-refresh every 3 seconds to catch quiz completions
    const interval = setInterval(fetchProgress, 3000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">No Learning Data Yet</h2>
          <p className="text-slate-600 mt-2">Start learning from resources to see your progress here.</p>
          <Link
            href="/dashboard/student/resources"
            className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </div>
    );
  }

  const allTopics = [
    ...(progressData.learningTopics || []),
    ...(progressData.completedTopics || []),
    ...(progressData.archivedTopics || []),
  ];

  let filteredTopics = allTopics;
  if (filter !== "all") {
    filteredTopics = allTopics.filter((t: LearningTopic) => t.status === filter);
  }

  if (sortBy === "subject") {
    filteredTopics.sort((a: LearningTopic, b: LearningTopic) =>
      a.subject.localeCompare(b.subject)
    );
  } else if (sortBy === "progress") {
    filteredTopics.sort((a: LearningTopic, b: LearningTopic) => b.progress - a.progress);
  } else {
    filteredTopics.sort(
      (a: LearningTopic, b: LearningTopic) =>
        (b.startedAt?.seconds || 0) - (a.startedAt?.seconds || 0)
    );
  }

  const stats = {
    totalTopics: allTopics.length,
    learning: progressData.learningTopics?.length || 0,
    completed: progressData.completedTopics?.length || 0,
    overallProgress: progressData.overallProgress || 0,
  };

  const subjectStats = Object.entries(progressData.subjectProgress || {}).map(
    ([subject, data]: [string, any]) => ({
      subject,
      ...data,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">Learning Progress</h1>
          <p className="text-foreground/60">Track your learning journey across all subjects and topics</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-6 border-white/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground/60 font-semibold">Overall Progress</p>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-4xl font-black text-primary">{stats.overallProgress}%</p>
            <p className="text-xs text-foreground/50 mt-2">
              {stats.completed} of {stats.totalTopics} topics
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-white/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground/60 font-semibold">Currently Learning</p>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-4xl font-black text-blue-600">{stats.learning}</p>
            <p className="text-xs text-foreground/50 mt-2">Topics in progress</p>
          </div>

          <div className="glass rounded-2xl p-6 border-white/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground/60 font-semibold">Completed</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-4xl font-black text-green-600">{stats.completed}</p>
            <p className="text-xs text-foreground/50 mt-2">Topics mastered</p>
          </div>

          <div className="glass rounded-2xl p-6 border-white/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-foreground/60 font-semibold">Subjects</p>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-4xl font-black text-purple-600">{subjectStats.length}</p>
            <p className="text-xs text-foreground/50 mt-2">Being tracked</p>
          </div>
        </div>

        {/* Subject Stats */}
        {subjectStats.length > 0 && (
          <div className="glass rounded-2xl p-8 border-white/60">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Progress by Subject
            </h2>

            <div className="space-y-6">
              {subjectStats.map((subject) => (
                <div key={subject.subject} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{subject.subject}</p>
                      <p className="text-sm text-foreground/50">
                        {subject.completed} of {subject.total} topics completed • {subject.learning} learning
                      </p>
                    </div>
                    <p className="text-2xl font-black text-primary">{subject.percentage}%</p>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500"
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="glass rounded-2xl p-8 border-white/60">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              All Topics
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition-all",
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                )}
              >
                All ({allTopics.length})
              </button>
              <button
                onClick={() => setFilter("learning")}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition-all",
                  filter === "learning"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                )}
              >
                Learning ({stats.learning})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition-all",
                  filter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                )}
              >
                Completed ({stats.completed})
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-slate-200 font-semibold bg-white cursor-pointer"
            >
              <option value="recent">Sort: Recent</option>
              <option value="subject">Sort: Subject</option>
              <option value="progress">Sort: Progress</option>
            </select>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length > 0 ? (
            <div className="space-y-4">
              {filteredTopics.map((topic: LearningTopic) => (
                <div
                  key={topic.id}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all hover:shadow-lg",
                    topic.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : topic.status === "learning"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {topic.status === "completed" && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {topic.status === "learning" && (
                          <Clock className="w-6 h-6 text-blue-600" />
                        )}
                        {topic.status === "archived" && (
                          <Archive className="w-6 h-6 text-slate-600" />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{topic.title}</h3>
                          <p className="text-sm text-foreground/60">
                            {topic.subject} • Grade {topic.grade}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {topic.status === "learning" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground/70">Learning Progress</span>
                            <span className="font-bold text-foreground">{topic.progress}%</span>
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${topic.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          Started:{" "}
                          {topic.startedAt?.seconds
                            ? new Date(topic.startedAt.seconds * 1000).toLocaleDateString()
                            : "N/A"}
                        </div>
                        {topic.testsAttempted && topic.testsAttempted > 0 && (
                          <>
                            <div className="flex items-center gap-2 text-foreground/60">
                              <Target className="w-4 h-4" />
                              Tests: {topic.testsCompleted}/{topic.testsAttempted}
                            </div>
                            <div className="flex items-center gap-2 text-foreground/60">
                              <Award className="w-4 h-4" />
                              Avg Score: {topic.averageScore}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right">
                      {topic.status === "completed" && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {topic.status === "learning" && (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                            <Clock className="w-4 h-4" />
                            In Progress
                          </span>
                          {topic.completedAt && (
                            <p className="text-xs text-foreground/50 mt-2">
                              Completed:{" "}
                              {new Date(topic.completedAt.seconds * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-foreground/60 font-semibold">No topics in this category yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
