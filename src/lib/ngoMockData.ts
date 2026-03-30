// src/lib/ngoMockData.ts

export const ngoStats = {
  totalStudents: 142,
  totalVolunteers: 38,
  activeSessions: 12,
  completedLessons: 1204,
  growthRate: 14.5
};

export const mockStudents = [
  { 
    uid: "s1", name: "Ravi Kumar", grade: "Grade 5", school: "Govt School Block A", 
    subjects: ["Math"], curiosities: ["Arts"], status: "Active",
    learningPace: "Moderate", learningPreference: "Visual", language: "Telugu, Hindi", 
    city: "Hyderabad", availableHours: ["Weekends AM"], hasInternet: true, 
    progressScore: 65, hasSmartphone: true, createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), specialNeeds: "None"
  },
  { 
    uid: "s2", name: "Priya Sharma", grade: "Grade 8", school: "ZPHS Hyderabad", 
    subjects: ["Science"], curiosities: ["English"], status: "Active",
    learningPace: "Fast", learningPreference: "Hands-on", language: "English, Hindi", 
    city: "Bangalore", availableHours: ["Weekdays PM"], hasInternet: true, 
    progressScore: 88, hasSmartphone: true, createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), specialNeeds: "None"
  },
  { 
    uid: "s3", name: "Rahul Verma", grade: "Grade 10", school: "KVS School", 
    subjects: ["Physics", "Math"], curiosities: ["Coding"], status: "Pending Match",
    learningPace: "Requires Patience", learningPreference: "Repetition", language: "Hindi", 
    city: "Mumbai", availableHours: ["Weekends PM"], hasInternet: false, 
    progressScore: 45, hasSmartphone: false, createdAt: new Date(Date.now() - 45 * 86400000).toISOString(), specialNeeds: "Dyslexia support"
  },
  { 
    uid: "s4", name: "Sita Devi", grade: "Grade 5", school: "Govt School Block A", 
    subjects: ["Telugu", "Math"], curiosities: [], status: "Active",
    learningPace: "Moderate", learningPreference: "Loud Reading", language: "Telugu", 
    city: "Hyderabad", availableHours: ["Weekdays AM"], hasInternet: true, 
    progressScore: 72, hasSmartphone: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), specialNeeds: "None"
  }
];

export const mockVolunteers = [
  { 
    uid: "v1", name: "Anita Reddy", subjects: ["Math", "Science"], grades: ["Grade 5", "Grade 6", "Grade 7"], status: "Active",
    teachingStyle: "Patient & Visual", skills: ["Origami"], languages: ["Telugu", "English", "Hindi"], city: "Hyderabad",
    travelArea: "5 km", availability: { days: ["Monday", "Saturday"], slots: ["Morning"], hoursPerWeek: 4 },
    studentsAssigned: ["s1", "s4"], maxStudentsAllowed: 3, impactScore: 9.5, yearsExperience: "2", bio: "Engineering student passionate about basics."
  },
  { 
    uid: "v2", name: "Rahul S", subjects: ["History", "Social"], grades: ["Grade 8", "Grade 9", "Grade 10"], status: "Active",
    teachingStyle: "Storytelling", skills: ["Debate"], languages: ["English", "Hindi"], city: "Mumbai",
    travelArea: "Remote Only", availability: { days: ["Sunday"], slots: ["Evening"], hoursPerWeek: 2 },
    studentsAssigned: ["s2"], maxStudentsAllowed: 2, impactScore: 8.0, yearsExperience: "1", bio: "History buffer who loves storytelling."
  },
  { 
    uid: "v3", name: "Sneha Patel", subjects: ["Math", "English", "Physics"], grades: ["Grade 8", "Grade 9", "Grade 10"], status: "Available",
    teachingStyle: "Rigorous & Test-focused", skills: ["Exam Prep", "Coding"], languages: ["English", "Hindi", "Gujarati"], city: "Mumbai",
    travelArea: "10 km", availability: { days: ["Saturday", "Sunday"], slots: ["Afternoon", "Evening"], hoursPerWeek: 8 },
    studentsAssigned: [], maxStudentsAllowed: 4, impactScore: 10.0, yearsExperience: "5+", bio: "Professional tutor volunteering on weekends."
  },
  { 
    uid: "v4", name: "Dr. Kiran", subjects: ["Science", "Biology"], grades: ["Grade 8", "Grade 9", "Grade 10"], status: "Available",
    teachingStyle: "Hands-on & Experimental", skills: ["Lab Demos"], languages: ["English", "Telugu"], city: "Bangalore",
    travelArea: "Remote Only", availability: { days: ["Friday"], slots: ["Evening"], hoursPerWeek: 3 },
    studentsAssigned: [], maxStudentsAllowed: 1, impactScore: 9.8, yearsExperience: "10+", bio: "Biologist sharing real-world science."
  }
];

export const mockSessions = [
  { id: "ses1", topic: "Fractions & Decimals", student: "Ravi Kumar", volunteer: "Anita Reddy", date: "Oct 25, 2026", time: "10:00 AM", status: "Upcoming", type: "Zoom" },
  { id: "ses2", topic: "Photosynthesis Basics", student: "Priya Sharma", volunteer: "Dr. Kiran", date: "Oct 26, 2026", time: "2:00 PM", status: "Upcoming", type: "Zoom" },
  { id: "ses3", topic: "Basic Addition", student: "Sita Devi", volunteer: "Sneha Patel", date: "Oct 20, 2026", time: "9:00 AM", status: "Completed", type: "In-Person" }
];

export const mockAnnouncements = [
  { id: "a1", title: "New Grade 5 Textbooks Added", date: "2 days ago", audience: "All" },
  { id: "a2", title: "Volunteer Workshop: Using Zoom", date: "1 week ago", audience: "Volunteers" }
];

export const performanceData = [
  { month: "Jan", students: 45, volunteers: 12 },
  { month: "Feb", students: 58, volunteers: 15 },
  { month: "Mar", students: 72, volunteers: 18 },
  { month: "Apr", students: 95, volunteers: 24 },
  { month: "May", students: 115, volunteers: 32 },
  { month: "Jun", students: 142, volunteers: 38 },
];

export const subjectDemandData = [
  { subject: "Math", demand: 85, volunteers: 20 },
  { subject: "Science", demand: 65, volunteers: 15 },
  { subject: "English", demand: 50, volunteers: 12 },
  { subject: "History", demand: 30, volunteers: 5 },
  { subject: "Coding", demand: 90, volunteers: 8 },
];

export const impactTreeData = [
  { name: "Hyderabad", size: 4500, fill: "#4f46e5" },
  { name: "Bangalore", size: 3200, fill: "#0ea5e9" },
  { name: "Mumbai", size: 2800, fill: "#10b981" },
  { name: "Delhi", size: 1500, fill: "#f59e0b" },
  { name: "Chennai", size: 900,  fill: "#ec4899" },
];
