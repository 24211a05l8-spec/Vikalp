import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  VOLUNTEER_APPLICATIONS: "volunteer_applications",
  VOLUNTEERS: "volunteers",
  SESSIONS: "sessions",
  WORKSHOPS: "workshops",
  PROGRESS: "progress",
  ASSIGNMENTS: "assignments",
  CALLS: "calls"
};

// --- User & Student Services ---

export async function createUserProfile(uid: string, data: any) {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function updateStudentProfile(uid: string, data: any) {
  await setDoc(doc(db, COLLECTIONS.STUDENTS, uid), {
    ...data,
    uid,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function getStudentProfile(uid: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.STUDENTS, uid));
  return snap.exists() ? snap.data() : null;
}

// --- Volunteer Services ---

export async function submitVolunteerApplication(data: any) {
  return await addDoc(collection(db, COLLECTIONS.VOLUNTEER_APPLICATIONS), {
    ...data,
    status: "pending",
    submittedAt: serverTimestamp()
  });
}

export async function getVolunteerApplication(id: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.VOLUNTEER_APPLICATIONS, id));
  return snap.exists() ? snap.data() : null;
}

export async function approveVolunteer(applicationId: string, uid: string) {
  const appSnap = await getDoc(doc(db, COLLECTIONS.VOLUNTEER_APPLICATIONS, applicationId));
  if (!appSnap.exists()) throw new Error("Application not found");
  
  const appData = appSnap.data();
  
  // Create volunteer profile
  await setDoc(doc(db, COLLECTIONS.VOLUNTEERS, uid), {
    uid,
    applicationId,
    deliveryType: appData.priority,
    subjects: appData.subjects || [],
    skills: appData.skills || [],
    availability: appData.availability || {},
    impactScore: 0,
    sessionsCompleted: 0,
    workshopsHosted: 0,
    studentsAssigned: [],
    status: "approved",
    approvedAt: serverTimestamp()
  });

  // Update application status
  await updateDoc(doc(db, COLLECTIONS.VOLUNTEER_APPLICATIONS, applicationId), {
    status: "approved"
  });

  // Update user role
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    role: "volunteer"
  });
}

export async function rejectVolunteer(applicationId: string) {
  await updateDoc(doc(db, COLLECTIONS.VOLUNTEER_APPLICATIONS, applicationId), {
    status: "rejected"
  });
}

export async function getVolunteerProfile(uid: string) {
  const snap = await getDoc(doc(db, COLLECTIONS.VOLUNTEERS, uid));
  return snap.exists() ? snap.data() : null;
}

export async function getStudentsForVolunteer(uid: string) {
  const q = query(
    collection(db, COLLECTIONS.STUDENTS),
    where("assignedVolunteerId", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Session & Workshop Services ---

export async function createSession(data: any) {
  return await addDoc(collection(db, COLLECTIONS.SESSIONS), {
    ...data,
    status: "scheduled",
    createdAt: serverTimestamp()
  });
}

export async function getSessionsForUser(userId: string, role: "student" | "volunteer") {
  const q = query(
    collection(db, COLLECTIONS.SESSIONS),
    where(role === "student" ? "studentId" : "volunteerId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => (b.scheduledAt?.seconds || 0) - (a.scheduledAt?.seconds || 0));
}

export async function createWorkshop(data: any) {
  return await addDoc(collection(db, COLLECTIONS.WORKSHOPS), {
    ...data,
    status: "pending_approval",
    registeredStudents: [],
    createdAt: serverTimestamp()
  });
}

export async function getUpcomingWorkshops() {
  const q = query(
    collection(db, COLLECTIONS.WORKSHOPS),
    where("status", "==", "approved")
  );
  const snap = await getDocs(q);
  const now = new Date();
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((w: any) => {
      const scheduled = w.scheduledAt?.seconds ? new Date(w.scheduledAt.seconds * 1000) : new Date(w.scheduledAt);
      return scheduled >= now;
    })
    .sort((a: any, b: any) => (a.scheduledAt?.seconds || 0) - (b.scheduledAt?.seconds || 0));
}

// --- Admin Services ---

export async function getPendingApplications() {
  const q = query(collection(db, COLLECTIONS.VOLUNTEER_APPLICATIONS), where("status", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUnassignedStudents() {
  const q = query(collection(db, COLLECTIONS.STUDENTS), where("assignedVolunteerId", "==", null));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAvailableVolunteers() {
  const q = query(collection(db, COLLECTIONS.VOLUNTEERS), where("status", "==", "approved"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function assignMatch(studentId: string, volunteerId: string, reason: string) {
  await updateDoc(doc(db, COLLECTIONS.STUDENTS, studentId), {
    assignedVolunteerId: volunteerId,
    status: "on-track"
  });
  
  await updateDoc(doc(db, COLLECTIONS.VOLUNTEERS, volunteerId), {
    studentsAssigned: [...(await getDoc(doc(db, COLLECTIONS.VOLUNTEERS, volunteerId))).data()?.studentsAssigned || [], studentId]
  });

  return await addDoc(collection(db, COLLECTIONS.ASSIGNMENTS), {
    studentId,
    volunteerId,
    claudeSuggestionReason: reason,
    assignedAt: serverTimestamp()
  });
}

export async function getGlobalStats() {
  const [students, volunteers, apps, sessions] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.STUDENTS)),
    getDocs(query(collection(db, COLLECTIONS.VOLUNTEERS), where("status", "==", "approved"))),
    getDocs(query(collection(db, COLLECTIONS.VOLUNTEER_APPLICATIONS), where("status", "==", "pending"))),
    getDocs(collection(db, COLLECTIONS.SESSIONS))
  ]);

  return {
    studentCount: students.size,
    volunteerCount: volunteers.size,
    pendingAppCount: apps.size,
    sessionCount: sessions.size
  };
}

// --- Progress Tracking Services ---

export interface LearningTopic {
  id: string;
  chapterId: string;
  title: string;
  subject: string;
  grade: number;
  status: "learning" | "completed" | "archived";
  startedAt: any;
  completedAt?: any;
  progress: number; // 0-100
  notes?: string;
  testsAttempted?: number;
  testsCompleted?: number;
  averageScore?: number;
}

export interface StudentProgress {
  uid: string;
  grade: number;
  overallProgress: number;
  totalTopicsCount: number;
  learningTopics: LearningTopic[];
  completedTopics: LearningTopic[];
  archivedTopics: LearningTopic[];
  subjectProgress: Record<string, { total: number; completed: number; learning: number }>;
  lastUpdated: any;
  streakDays: number;
}

export async function startLearningTopic(uid: string, chapterId: string, chapterData: any) {
  try {
    const progressRef = doc(db, COLLECTIONS.PROGRESS, uid);
    const progressSnap = await getDoc(progressRef);
    
    const currentProgress = progressSnap.exists() ? progressSnap.data() : {
      uid,
      learningTopics: [],
      completedTopics: [],
      archivedTopics: [],
      subjectProgress: {},
      overallProgress: 0,
      totalTopicsCount: 0,
      grade: chapterData.grade,
      streakDays: 0,
      lastUpdated: serverTimestamp()
    };

    // Check if topic is already being learned or completed
    const existingLearning = currentProgress.learningTopics?.find((t: LearningTopic) => t.chapterId === chapterId);
    const existingCompleted = currentProgress.completedTopics?.find((t: LearningTopic) => t.chapterId === chapterId);

    if (existingLearning || existingCompleted) {
      console.log("Topic already exists in progress:", chapterId);
      return; // Already learning or completed
    }

    const newTopic: LearningTopic = {
      id: `${uid}-${chapterId}`,
      chapterId,
      title: chapterData.title || "Untitled",
      subject: chapterData.subject || "Unknown",
      grade: chapterData.grade || 5,
      status: "learning",
      startedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      progress: 0,
      testsAttempted: 0,
      testsCompleted: 0,
      averageScore: 0
    };

    const learningTopics = [...(currentProgress.learningTopics || []), newTopic];
    const subjectKey = chapterData.subject || "Unknown";
    const currentSubjectProgress = currentProgress.subjectProgress?.[subjectKey] || { total: 0, completed: 0, learning: 0 };
    
    const totalTopics = learningTopics.length + (currentProgress.completedTopics?.length || 0);
    const completedCount = currentProgress.completedTopics?.length || 0;
    const newOverallProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    const updateData = {
      ...currentProgress,
      learningTopics,
      totalTopicsCount: totalTopics,
      overallProgress: newOverallProgress,
      subjectProgress: {
        ...currentProgress.subjectProgress,
        [subjectKey]: {
          ...currentSubjectProgress,
          total: currentSubjectProgress.total + 1,
          learning: (currentSubjectProgress.learning || 0) + 1
        }
      },
      lastUpdated: serverTimestamp()
    };

    console.log("Saving progress update:", updateData);
    await setDoc(progressRef, updateData, { merge: true });
    console.log("Successfully started learning:", chapterId);
  } catch (error) {
    console.error("Error in startLearningTopic:", error);
    throw error;
  }
}

export async function markTopicAsLearned(uid: string, chapterId: string) {
  try {
    const progressRef = doc(db, COLLECTIONS.PROGRESS, uid);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      console.error("Progress document doesn't exist for user:", uid);
      return;
    }

    const currentProgress = progressSnap.data() as StudentProgress;
    const topicIndex = currentProgress.learningTopics?.findIndex((t: LearningTopic) => t.chapterId === chapterId);

    if (topicIndex === -1 || topicIndex === undefined || topicIndex === null) {
      console.error("Topic not found in learning topics:", chapterId);
      return;
    }

    const topic = currentProgress.learningTopics[topicIndex];
    
    // Move topic to completed
    const completedTopic: LearningTopic = {
      ...topic,
      status: "completed",
      progress: 100,
      completedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    };

    const updatedLearningTopics = currentProgress.learningTopics.filter((_, i) => i !== topicIndex);
    const completedTopics = [...(currentProgress.completedTopics || []), completedTopic];

    // Update subject progress
    const subjectKey = topic.subject;
    const subjectProgress = currentProgress.subjectProgress?.[subjectKey] || { total: 0, completed: 0, learning: 0 };
    const newSubjectProgress = {
      ...subjectProgress,
      learning: Math.max(0, (subjectProgress.learning || 0) - 1),
      completed: (subjectProgress.completed || 0) + 1
    };

    // Calculate overall progress
    const totalTopics = completedTopics.length + updatedLearningTopics.length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

    const updateData = {
      ...currentProgress,
      learningTopics: updatedLearningTopics,
      completedTopics,
      overallProgress,
      totalTopicsCount: totalTopics,
      subjectProgress: {
        ...currentProgress.subjectProgress,
        [subjectKey]: newSubjectProgress
      },
      lastUpdated: serverTimestamp()
    };

    console.log("Marking topic as learned, update data:", updateData);
    await setDoc(progressRef, updateData, { merge: true });
    console.log("Successfully marked as learned:", chapterId);
  } catch (error) {
    console.error("Error in markTopicAsLearned:", error);
    throw error;
  }
}

export async function updateTopicProgress(uid: string, chapterId: string, progress: number, testScore?: number) {
  try {
    const progressRef = doc(db, COLLECTIONS.PROGRESS, uid);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.error("Progress document doesn't exist:", uid);
      return;
    }

    const currentProgress = progressSnap.data() as StudentProgress;
    const topicIndex = currentProgress.learningTopics?.findIndex((t: LearningTopic) => t.chapterId === chapterId);

    if (topicIndex === -1 || topicIndex === undefined) {
      console.error("Topic not found in learning topics:", chapterId);
      return;
    }

    const topic = currentProgress.learningTopics[topicIndex];

    const updatedTopics = currentProgress.learningTopics.map((t: LearningTopic, idx: number) => {
      if (idx === topicIndex) {
        const updatedTopic = { ...t, progress };
        if (testScore !== undefined) {
          updatedTopic.testsAttempted = (updatedTopic.testsAttempted || 0) + 1;
          if (testScore >= 50) {
            updatedTopic.testsCompleted = (updatedTopic.testsCompleted || 0) + 1;
          }
          const prevAvg = updatedTopic.averageScore || 0;
          const attemptCount = updatedTopic.testsAttempted;
          updatedTopic.averageScore = Math.round(((prevAvg * (attemptCount - 1)) + testScore) / attemptCount);
        }
        return updatedTopic;
      }
      return t;
    });

    const updateData = {
      ...currentProgress,
      learningTopics: updatedTopics,
      lastUpdated: serverTimestamp()
    };

    console.log("Updating topic progress:", updateData);
    await setDoc(progressRef, updateData, { merge: true });
    console.log("Successfully updated progress:", chapterId);
  } catch (error) {
    console.error("Error in updateTopicProgress:", error);
    throw error;
  }
}

export async function getStudentProgress(uid: string): Promise<StudentProgress | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.PROGRESS, uid));
  return snap.exists() ? (snap.data() as StudentProgress) : null;
}

export async function getStudentProgressStats(uid: string) {
  const progress = await getStudentProgress(uid);
  if (!progress) {
    return {
      overallProgress: 0,
      learningCount: 0,
      completedCount: 0,
      subjectsTracking: [],
      recentTopics: []
    };
  }

  const subjectsTracking = Object.entries(progress.subjectProgress).map(([subject, stats]) => ({
    subject,
    ...stats
  }));

  const recentTopics = [
    ...progress.learningTopics,
    ...progress.completedTopics
  ].sort((a, b) => (b.startedAt?.seconds || 0) - (a.startedAt?.seconds || 0)).slice(0, 5);

  return {
    overallProgress: progress.overallProgress || 0,
    learningCount: progress.learningTopics?.length || 0,
    completedCount: progress.completedTopics?.length || 0,
    totalCount: (progress.learningTopics?.length || 0) + (progress.completedTopics?.length || 0),
    subjectsTracking,
    recentTopics
  };
}
