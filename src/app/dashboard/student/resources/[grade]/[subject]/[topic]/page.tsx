"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, CheckCircle2, Bookmark, 
  Share2, Play, Info, Lightbulb, GraduationCap, 
  ArrowRight, Loader2, Trophy, ShieldCheck,
  ExternalLink, Video, BookOpen
} from "lucide-react";
import { getAIResource, AIContent } from "@/lib/ai-assistant";
import { useAuth } from "@/context/AuthContext";
import { getStudentProfile, updateStudentProfile, updateTopicProgress, markTopicAsLearned } from "@/lib/db";
import { NCERT_DATA } from "@/lib/resources/ncert-data";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function StudyPortalPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [content, setContent] = useState<AIContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const gradeParam = parseInt(params.grade as string) || 5;
  const subjectParam = params.subject as string;
  const topicParam = decodeURIComponent(params.topic as string);
  const chapter = NCERT_DATA[gradeParam]?.[subjectParam]?.find(ch => ch.title === topicParam);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAIResource(
          gradeParam, 
          subjectParam, 
          topicParam
        );
        setContent(data);
      } catch (e) {
        toast.error("Failed to load content.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, params.subject, params.topic]);

  const handleSelect = (ans: string) => {
    setAnswers({ ...answers, [currentQ]: ans });
  };

  const next = () => {
    if (!answers[currentQ]) {
      toast.error("Pick an answer!");
      return;
    }
    if (currentQ < (content?.quiz.length || 0) - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    setIsFinishing(true);
    try {
      if (!user || !chapter) return;

      // Calculate Score
      let correct = 0;
      const totalQuestions = content?.quiz.length || 0;
      content?.quiz.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      const scorePercentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

      // Update topic progress with score
      await updateTopicProgress(user!.uid, chapter.id || topicParam, 100, scorePercentage);

      // Mark topic as learned
      await markTopicAsLearned(user!.uid, chapter.id || topicParam);

      // Update Profile
      await updateStudentProfile(user!.uid, {
         completedTopics: [params.topic as string],
         lastStudied: new Date().toISOString()
      });

      setQuizFinished(true);
      toast.success("🎉 Awesome! You've mastered this topic! Your progress has been updated.");
    } catch (e) {
      console.error("Quiz finish error:", e);
      toast.error("Failed to save progress.");
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-primary font-black">AI IS PREPARING YOUR LESSON...</div>;
  if (!content) return <div className="h-screen flex items-center justify-center text-rose-500 font-black">TOPIC NOT FOUND</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-8">
      {/* Navigation & Actions */}
      <nav className="flex items-center justify-between">
         <button 
           onClick={() => router.back()} 
           className="p-4 glass bg-white/40 rounded-2xl text-foreground/40 hover:text-primary transition-colors flex items-center gap-3 font-bold"
         >
           <ArrowLeft className="w-5 h-5" />
           Library
         </button>
         <div className="flex items-center gap-3">
            <button className="p-4 glass bg-white/40 rounded-2xl text-foreground/40 hover:text-primary transition-all"><Bookmark className="w-5 h-5" /></button>
            <button className="p-4 glass bg-white/40 rounded-2xl text-foreground/40 hover:text-primary transition-all"><Share2 className="w-5 h-5" /></button>
         </div>
      </nav>

      {/* Header Topic Title */}
      <header className="space-y-6">
         <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{content.subject}</span>
            <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">{content.grade}</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">{content.topic}</h1>
         
         <div className="flex flex-wrap items-center gap-4 pt-4">
            {chapter?.pdfUrl && (
               <a 
                 href={chapter.pdfUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
               >
                 <BookOpen className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                 Official Textbook
                 <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-50" />
               </a>
            )}
            {chapter?.videoUrl && (
               <a 
                 href={chapter.videoUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
               >
                 <Video className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                 Watch Video Lesson
                 <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-50" />
               </a>
            )}
         </div>
      </header>

      {!isQuizMode ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Section 1: Definition */}
           <section className="p-10 glass bg-white/60 rounded-[3rem] border-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Info className="w-6 h-6" /></div>
                 <h2 className="text-2xl font-black">Introduction</h2>
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground/80 leading-relaxed relative z-10 italic">
                 "{content.content.definition}"
              </p>
           </section>

           {/* Section 2: Key Concepts */}
           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 glass bg-slate-900 rounded-[3rem] text-white shadow-2xl space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-white"><Lightbulb className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-black">Key Concepts</h2>
                 </div>
                 <ul className="space-y-6">
                    {content.content.key_points.map((pt, i) => (
                       <li key={i} className="flex gap-4 group">
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-primary font-black shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform">{i+1}</div>
                          <p className="text-white/70 font-bold leading-relaxed">{pt}</p>
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="p-10 glass bg-white/60 rounded-[3rem] border-white shadow-xl space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500"><GraduationCap className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-black">Real Life Examples</h2>
                 </div>
                 <div className="space-y-6">
                    {content.content.examples.map((ex, i) => (
                       <div key={i} className="p-6 bg-white/40 rounded-2xl border border-white/60 flex gap-4">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <p className="font-bold text-foreground/60 italic">{ex}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </section>

           {/* Section 3: Summary */}
           <section className="p-10 glass bg-primary/5 rounded-[3rem] border-primary/20 shadow-xl border-2 text-center space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary text-center">Summary Box</h3>
              <p className="text-lg font-black text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                 {content.content.summary}
              </p>
           </section>

           {/* Footer: Launch Quiz */}
           <div className="pt-12 text-center space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-full text-emerald-600 text-xs font-black uppercase tracking-widest mb-4">
                 <ShieldCheck className="w-4 h-4" />
                 Ready to test your knowledge?
              </div>
              <button 
                 onClick={() => setIsQuizMode(true)}
                 className="w-full py-8 bg-primary text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                 Start Topic Challenge
                 <Play className="w-8 h-8 fill-white" />
              </button>
           </div>
        </div>
      ) : quizFinished ? (
        <div className="text-center space-y-12 animate-in zoom-in duration-500">
           <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto shadow-2xl rotate-3">
              <Trophy className="w-16 h-16" />
           </div>
           <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight">Challenge <span className="text-primary italic">Conquered</span>!</h2>
              <p className="text-xl text-foreground/40 font-bold max-w-md mx-auto">You've successfully completed the {content.topic} assessment with flying colors! 🌟</p>
           </div>
           <button 
              onClick={() => router.push("/dashboard/student/resources")}
              className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
           >
              Back to Library
              <ArrowRight className="w-6 h-6" />
           </button>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
           {/* Quiz Flow UI */}
           <div className="flex items-center justify-between mb-8">
              <div className="w-full h-3 bg-slate-100 rounded-full mr-8 overflow-hidden shadow-inner">
                 <div className="h-full bg-primary transition-all duration-700" style={{ width: `${((currentQ + 1) / content.quiz.length) * 100}%` }} />
              </div>
              <span className="text-sm font-black text-foreground/40 shrink-0">{currentQ + 1} / {content.quiz.length}</span>
           </div>

           <div className="space-y-12">
              <h2 className="text-4xl font-black tracking-tight leading-tight">{content.quiz[currentQ].question}</h2>
              <div className="grid grid-cols-1 gap-4">
                 {content.quiz[currentQ].options.map((opt, i) => (
                   <button 
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "group p-8 glass rounded-[2.5rem] border-white/60 text-left transition-all duration-300 hover:-translate-y-1 relative overflow-hidden",
                        answers[currentQ] === opt ? "bg-primary border-primary ring-4 ring-primary/10 shadow-2xl" : "bg-white/40 hover:bg-white"
                      )}
                   >
                      <div className="flex items-center gap-6 relative z-10">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all",
                           answers[currentQ] === opt ? "bg-white text-primary" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                         )}>
                            {String.fromCharCode(65 + i)}
                         </div>
                         <span className={cn("text-xl font-bold", answers[currentQ] === opt ? "text-white" : "text-foreground/70")}>{opt}</span>
                      </div>
                   </button>
                 ))}
              </div>

              <div className="flex items-center justify-between pt-12">
                 <button 
                   onClick={() => setIsQuizMode(false)}
                   className="text-foreground/40 font-black flex items-center gap-2 hover:text-rose-500 transition-colors"
                 >
                    Exit Challenge
                 </button>
                 <button 
                   onClick={next}
                   disabled={isFinishing}
                   className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    {isFinishing ? <Loader2 className="w-6 h-6 animate-spin" /> : currentQ === content.quiz.length - 1 ? "Complete Master" : "Next Discovery"}
                    <ArrowRight className="w-6 h-6" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
