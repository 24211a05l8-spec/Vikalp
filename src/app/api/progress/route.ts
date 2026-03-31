import { NextRequest, NextResponse } from "next/server";
import {
  startLearningTopic,
  markTopicAsLearned,
  updateTopicProgress,
  getStudentProgress
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { action, uid, chapterId, chapterData, progress, testScore } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    switch (action) {
      case "start":
        if (!chapterId || !chapterData) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await startLearningTopic(uid, chapterId, chapterData);
        return NextResponse.json({ success: true, message: "Learning started" });

      case "complete":
        if (!chapterId) {
          return NextResponse.json({ error: "Chapter ID required" }, { status: 400 });
        }
        await markTopicAsLearned(uid, chapterId);
        return NextResponse.json({ success: true, message: "Topic marked as learned" });

      case "update":
        if (!chapterId || progress === undefined) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await updateTopicProgress(uid, chapterId, progress, testScore);
        return NextResponse.json({ success: true, message: "Progress updated" });

      case "get":
        const progressData = await getStudentProgress(uid);
        return NextResponse.json(progressData);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
