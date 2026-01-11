
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ToolId, User, HomeworkCheckResult, SolverResult, AIDetectionResult, MistakeAnalysis, StudyPlan, StudyPlanDay, HandwrittenCleanResult, SolverMode } from '../types';
import { geminiService } from '../services/geminiService';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';

// --- Reference Examples for Each Tool ---

interface ExampleProps {
  onTry: (text: string, text2?: string) => void;
}

const HomeworkCheckExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-6 sm:mb-8">
      <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Reference Example</h4>
      <p className="text-slate-400 font-bold px-4">Rubrix scans handwriting and applies academic diagnostics.</p>
    </div>
    <div className="bg-[#fdfbf7] rounded-[2rem] sm:rounded-[3.5rem] border-2 border-slate-200 shadow-2xl relative overflow-hidden p-6 sm:p-10 transform -rotate-1 hover:rotate-0 transition-transform duration-700 mx-2 sm:mx-0">
      <div className="space-y-8 sm:space-y-10">
        <div className="relative">
          <div className="font-['Cursive'] text-2xl sm:text-3xl text-blue-900 opacity-70 italic mb-2" style={{ fontFamily: 'cursive' }}>Q1: Solve 3x + 5 = 20</div>
          <div className="font-['Cursive'] text-xl sm:text-2xl text-blue-800 opacity-60 ml-4 sm:ml-8" style={{ fontFamily: 'cursive' }}>3x = 15, x = 5</div>
          <div className="mt-3 flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span><span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">Valid Method</span></div>
        </div>
        <div className="relative">
          <div className="font-['Cursive'] text-2xl sm:text-3xl text-blue-900 opacity-70 italic mb-2" style={{ fontFamily: 'cursive' }}>Q2: Balance H2 + O2 → H2O</div>
          <div className="font-['Cursive'] text-xl sm:text-2xl text-blue-800 opacity-60 ml-4 sm:ml-8" style={{ fontFamily: 'cursive' }}>2H2 + O2 = 2H2O</div>
          <div className="mt-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">✕</span><span className="text-rose-600 font-black text-[10px] uppercase tracking-widest">Subscript Error</span></div>
            <p className="text-rose-900 text-xs font-bold">Standard chemical notation requires subscripts for molecules.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-slate-200 flex justify-center">
        <button 
          onClick={() => onTry("Q1: Solve 3x + 5 = 20\nQ2: Balance H2 + O2 -> H2O", "Q1: 3x=15, x=5\nQ2: 2H2 + O2 = 2H2O")}
          className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Try This Example
        </button>
      </div>
    </div>
  </div>
);

const SolverExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] mb-2">Neural Solver Logic</h4>
      <p className="text-slate-400 font-bold">Complex problems deconstructed into logical sequences.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-20"><div className="w-24 h-24 border-4 border-meta-accent rounded-full border-t-transparent animate-spin"></div></div>
      <div className="mb-8">
        <p className="text-[10px] font-black text-meta-accent uppercase tracking-widest mb-2">Input Query</p>
        <p className="text-2xl font-black text-white">"Solve x² + 5x + 6 = 0 using factoring."</p>
      </div>
      <div className="space-y-6">
        <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-meta-accent/20 flex items-center justify-center text-meta-accent font-black text-xs">1</div><p className="text-slate-300 font-bold text-base">Identify factors of 6 that sum to 5: (2 and 3).</p></div>
        <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-meta-accent/20 flex items-center justify-center text-meta-accent font-black text-xs">2</div><p className="text-slate-300 font-bold text-base">Rewrite equation: (x + 2)(x + 3) = 0.</p></div>
        <div className="pt-6 border-t border-white/5"><p className="text-3xl font-black text-white">x = -2, x = -3</p></div>
      </div>
      <div className="mt-10 flex justify-center">
        <button 
          onClick={() => onTry("Solve x² + 5x + 6 = 0 using factoring.")}
          className="bg-meta-accent text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Load Solver Example
        </button>
      </div>
    </div>
  </div>
);

const AIDetectionExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2">Syntactic Scan Preview</h4>
      <p className="text-slate-400 font-bold">Differentiating between biological and synthetic writing styles.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-8 sm:p-10 border border-white/10 space-y-6">
      <div className="p-6 bg-white/5 rounded-2xl leading-relaxed text-slate-300 font-bold text-lg">
        <span className="bg-blue-500/30 border-b-2 border-blue-400 text-white">The process of photosynthesis is fundamental to all life on Earth.</span> 
        <span> Plants absorb sunlight and convert it into chemical energy.</span>
        <span className="bg-purple-500/30 border-b-2 border-purple-400 text-white"> This energy is then used to fuel the organism's activities.</span>
      </div>
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">98% AI Probable</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div><span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Human Baseline</span></div>
      </div>
      <div className="mt-4 flex justify-center">
        <button 
          onClick={() => onTry("The process of photosynthesis is fundamental to all life on Earth. Plants absorb sunlight and convert it into chemical energy. This energy is then used to fuel the organism's activities.")}
          className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Check AI Content
        </button>
      </div>
    </div>
  </div>
);

const MistakeTrackerExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-2">Topic Diagnostic Analytics</h4>
      <p className="text-slate-400 font-bold">Identifying critical gaps in your academic archive.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-8 sm:p-10 border border-white/10 space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-white">Organic Chemistry</span><span className="text-rose-500">Critical (85%)</span></div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[85%] rounded-full"></div></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-white">Calculus III</span><span className="text-meta-accent">Developing (30%)</span></div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-meta-accent w-[30%] rounded-full"></div></div>
        </div>
      </div>
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-xs font-bold text-slate-400 leading-relaxed italic">"Frequent errors detected in stereochemistry and reaction mechanisms. Focus on Day 1-3 of the auto-generated Study Plan."</p>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onTry("I keep getting stereochemistry questions wrong on my chemistry tests. My calculus grades are okay but I struggle with triple integrals.")}
          className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Analyze My Mistakes
        </button>
      </div>
    </div>
  </div>
);

const HandwritingCleanerExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] mb-2">OCR Signal Enhancement</h4>
      <p className="text-slate-400 font-bold">Turning messy digital ink into structured documentation.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="p-8 bg-[#fdfbf7] rounded-[2.5rem] border-2 border-slate-200">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest">Source (Messy)</p>
        <div className="font-['Cursive'] text-xl text-blue-900 opacity-40 italic" style={{ fontFamily: 'cursive' }}>
          Mitosis has 4 phases... pro-phaze, meta-phaze, ana-phaze, and telo-phaze.
        </div>
      </div>
      <div className="p-8 glass-premium rounded-[2.5rem] border border-meta-accent/30 shadow-2xl">
        <p className="text-[9px] font-black text-meta-accent uppercase mb-4 tracking-widest">Enhanced Output</p>
        <div className="text-lg font-black text-white leading-tight">
          Mitosis comprises four distinct phases: prophase, metaphase, anaphase, and telophase.
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <button 
        onClick={() => onTry("Handwritten notes about mitosis: prophase, metaphase, anaphase, and telophase.")}
        className="bg-meta-accent text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
      >
        Simulate OCR Clean
      </button>
    </div>
  </div>
);

const StudyPlanExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] mb-2">Sync Schedule Preview</h4>
      <p className="text-slate-400 font-bold">Personalized 7-day high-intensity learning path.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-8 border border-white/10 space-y-8">
      <div className="space-y-4">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex gap-6 items-center">
          <div className="w-12 h-12 rounded-xl bg-aurora flex items-center justify-center font-black text-white">01</div>
          <div>
            <p className="text-[9px] font-black text-meta-accent uppercase tracking-widest mb-1">Fundamental Review</p>
            <p className="text-base font-bold text-white">Mastering Atomic Structures & Orbitals</p>
          </div>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex gap-6 items-center opacity-60">
          <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center font-black text-white">02</div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Advanced Logic</p>
            <p className="text-base font-bold text-slate-400">Chemical Bonding & Hybridization Lab</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onTry("I am struggling with Chemistry, specifically atomic structure and chemical bonding. I have a test in one week.")}
          className="bg-aurora text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Generate My Plan
        </button>
      </div>
    </div>
  </div>
);

const QAGeneratorExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] mb-2">Question Maker Preview</h4>
      <p className="text-slate-400 font-bold">Turning static notes into active recall challenges.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-8 border border-white/10 space-y-6">
      <div className="p-4 bg-white/5 rounded-xl border-l-4 border-meta-accent"><p className="text-xs text-slate-400 italic">"Mitochondria generate ATP as a chemical energy source."</p></div>
      <div className="p-6 bg-meta-accent/10 rounded-2xl border border-meta-accent/20">
        <p className="text-[9px] font-black text-meta-accent uppercase mb-2">Generated MCQ</p>
        <p className="font-bold text-white mb-4">What is the primary chemical product of Mitochondria used for energy?</p>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400"><div className="p-2 border border-white/10 rounded-lg">A) Glucose</div><div className="p-2 border border-meta-accent/50 text-meta-accent bg-meta-accent/10 rounded-lg">B) ATP</div></div>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onTry("Mitochondria generate ATP as a chemical energy source for cellular activities. They are known as the powerhouse of the cell.")}
          className="bg-meta-accent text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Create Questions
        </button>
      </div>
    </div>
  </div>
);

const ExamRewriterExample: React.FC<ExampleProps> = ({ onTry }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
    <div className="text-center mb-8">
      <h4 className="text-[10px] font-black text-meta-gold uppercase tracking-[0.4em] mb-2">Prose Elevation Logic</h4>
      <p className="text-slate-400 font-bold">Converting informal notes into high-scoring exam responses.</p>
    </div>
    <div className="glass-premium rounded-[3rem] p-10 border border-white/10 space-y-8">
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Informal Draft</p>
        <p className="text-slate-400 font-bold italic text-base">"WWI started because Archduke got shot and countries had alliances."</p>
      </div>
      <div className="p-8 bg-aurora/10 rounded-[2rem] border border-meta-accent/30 shadow-xl">
        <p className="text-[9px] font-black text-meta-accent uppercase mb-3 tracking-widest">Academic Reformulation</p>
        <p className="text-lg font-black text-white leading-tight">
          "The onset of World War I was precipitated by the assassination of Archduke Franz Ferdinand, which subsequently activated a pre-existing complex network of mutual defense alliances across Europe."
        </p>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onTry("WWI started because Archduke got shot and countries had alliances.")}
          className="bg-gold-glow text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          Refine My Prose
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---

interface ToolViewProps {
  user: User | null;
}

const ToolView: React.FC<ToolViewProps> = ({ user }) => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOLS.find(t => t.id === toolId);
  
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState(''); 
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [solverMode, setSolverMode] = useState<SolverMode>('detailed');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!tool) return <div className="p-10 text-center font-black">Tool not found</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Could not open camera.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  useEffect(() => () => stopCamera(), []);

  const saveToFirebase = async (data: any) => {
    if (!user) return;
    try {
      const historyRef = ref(db, `users/${user.id}/history`);
      const newEntryRef = push(historyRef);
      await set(newEntryRef, {
        toolId: tool.id,
        timestamp: Date.now(),
        query: inputText,
        result: data
      });
    } catch (e) {
      console.error("Firebase Save Error:", e);
    }
  };

  const handleRun = async () => {
    if (!inputText && !image) {
      alert("Please provide some text or an image.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      let finalResult;
      switch (tool.id) {
        case ToolId.HOMEWORK_CHECK:
          finalResult = await geminiService.analyzeHomework(inputText, inputText2, image || undefined);
          break;
        case ToolId.SOLVER:
          finalResult = await geminiService.solveHomework(inputText, solverMode, image || undefined);
          break;
        case ToolId.AI_DETECTION:
          finalResult = await geminiService.detectAI(inputText);
          break;
        case ToolId.HANDWRITTEN_CLEANER:
          if (!image) throw new Error("Upload an image first.");
          finalResult = await geminiService.cleanHandwriting(image);
          break;
        case ToolId.MISTAKE_TRACKER:
          finalResult = await geminiService.analyzeMistakes(inputText, image || undefined);
          break;
        case ToolId.STUDY_PLAN:
          finalResult = await geminiService.generateStudyPlan(inputText);
          break;
        default:
          finalResult = "Coming soon!";
      }
      setResult(finalResult);
      saveToFirebase(finalResult);
    } catch (error) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTry = (text: string, text2: string = '') => {
    setInputText(text);
    setInputText2(text2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to render the correct example based on toolId
  const renderExample = () => {
    switch (tool.id) {
      case ToolId.HOMEWORK_CHECK: return <HomeworkCheckExample onTry={handleTry} />;
      case ToolId.SOLVER: return <SolverExample onTry={handleTry} />;
      case ToolId.AI_DETECTION: return <AIDetectionExample onTry={handleTry} />;
      case ToolId.MISTAKE_TRACKER: return <MistakeTrackerExample onTry={handleTry} />;
      case ToolId.HANDWRITTEN_CLEANER: return <HandwritingCleanerExample onTry={handleTry} />;
      case ToolId.STUDY_PLAN: return <StudyPlanExample onTry={handleTry} />;
      case ToolId.QA_GENERATOR: return <QAGeneratorExample onTry={handleTry} />;
      case ToolId.REWRITE_EXAM: return <ExamRewriterExample onTry={handleTry} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-12">
        <Link to="/tools" className="inline-flex items-center gap-2 sm:gap-3 text-meta-accent font-black tracking-widest text-[10px] sm:text-xs group">
          <span className="bg-white/5 p-2 sm:p-3 rounded-full border border-white/10 group-hover:-translate-x-1 transition-transform">←</span>
          BACK TO DASHBOARD
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
        {/* Left Side: Input */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 order-2 lg:order-1">
          <div className="p-6 sm:p-10 glass-premium rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl">{tool.icon}</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{tool.title}</h1>
                <p className="text-slate-400 font-bold text-xs sm:text-sm">{tool.description}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {tool.id === ToolId.SOLVER && (
                <div className="flex gap-1 sm:gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setSolverMode('simple')}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${solverMode === 'simple' ? 'bg-meta-accent text-slate-900 shadow-lg' : 'text-slate-400'}`}
                  >
                    Simple
                  </button>
                  <button 
                    onClick={() => setSolverMode('detailed')}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${solverMode === 'detailed' ? 'bg-meta-accent text-slate-900 shadow-lg' : 'text-slate-400'}`}
                  >
                    Detailed
                  </button>
                </div>
              )}

              <div className="relative">
                <label className="block text-[9px] sm:text-[10px] font-black text-meta-accent uppercase tracking-widest mb-2 px-2">
                  {tool.id === ToolId.HOMEWORK_CHECK ? 'The Questions' : 'Type your homework'}
                </label>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={tool.example}
                  className="w-full h-40 sm:h-64 p-4 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-[2.5rem] focus:ring-4 focus:ring-meta-accent/10 outline-none resize-none transition-all text-base sm:text-lg font-bold text-slate-700 dark:text-white placeholder:text-slate-500 shadow-inner"
                />
              </div>

              {tool.id === ToolId.HOMEWORK_CHECK && (
                <div className="relative">
                  <label className="block text-[9px] sm:text-[10px] font-black text-meta-accent uppercase tracking-widest mb-2 px-2">Your Answers</label>
                  <textarea 
                    value={inputText2}
                    onChange={(e) => setInputText2(e.target.value)}
                    placeholder="Enter your answers here..."
                    className="w-full h-40 sm:h-64 p-4 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-[2.5rem] focus:ring-4 focus:ring-meta-accent/10 outline-none resize-none transition-all text-base sm:text-lg font-bold text-slate-700 dark:text-white placeholder:text-slate-500 shadow-inner"
                  />
                </div>
              )}

              {![ToolId.AI_DETECTION, ToolId.STUDY_PLAN].includes(tool.id as ToolId) && (
                <div className="group border-2 border-dashed border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-4 text-center hover:bg-white/5 transition-all cursor-pointer">
                  {image ? (
                    <div className="relative p-2 sm:p-4">
                      <img src={image} alt="Preview" className="max-h-48 sm:max-h-64 mx-auto rounded-xl sm:rounded-3xl shadow-2xl border-4 border-white/10" />
                      <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black">✕</button>
                    </div>
                  ) : isCameraOpen ? (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:gap-4">
                        <button onClick={capturePhoto} className="bg-meta-accent text-slate-900 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Capture</button>
                        <button onClick={stopCamera} className="bg-white/20 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Cancel</button>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:gap-4">
                      <div onClick={() => startCamera()} className="flex-1 bg-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 flex flex-col items-center justify-center hover:bg-white/10">
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📷</div>
                        <p className="font-black text-[10px] text-slate-300">Camera</p>
                      </div>
                      <div onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 flex flex-col items-center justify-center hover:bg-white/10">
                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📁</div>
                        <p className="font-black text-[10px] text-slate-300">Upload</p>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
              )}

              <button 
                disabled={loading}
                onClick={handleRun}
                className={`w-full py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl text-slate-900 shadow-premium transition-all active:scale-[0.98] ${loading ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-aurora hover:brightness-110'}`}
              >
                {loading ? 'Thinking...' : 'Get Analysis'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-10 order-1 lg:order-2">
          {!result && !loading && (
            <div className="flex flex-col gap-6 sm:gap-10">
              <div className="min-h-[300px] sm:h-[400px] border-2 border-dashed border-white/5 rounded-[2rem] sm:rounded-[4rem] flex flex-col items-center justify-center text-center p-10 sm:p-20 glass-premium opacity-50">
                <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 animate-float">💡</div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-300 mb-2">Ready to assist</h3>
                <p className="text-slate-500 font-bold max-w-sm px-4">Provide your homework details to begin the AI analysis.</p>
              </div>
              
              {renderExample()}
            </div>
          )}

          {loading && (
            <div className="p-8 sm:p-12 glass-premium rounded-[2rem] sm:rounded-[4rem] border border-white/10 space-y-6 sm:space-y-8 animate-pulse">
              <div className="h-8 sm:h-10 bg-white/5 rounded-2xl w-1/2"></div>
              <div className="space-y-4">
                <div className="h-3 sm:h-4 bg-white/5 rounded-xl w-full"></div>
                <div className="h-3 sm:h-4 bg-white/5 rounded-xl w-5/6"></div>
              </div>
              <div className="h-48 sm:h-64 bg-white/5 rounded-[2rem] sm:rounded-[3rem] w-full"></div>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6 sm:space-y-8">
              {/* HOMEWORK CHECK VIEW */}
              {tool.id === ToolId.HOMEWORK_CHECK && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="p-6 sm:p-10 glass-premium rounded-[2.5rem] sm:rounded-[4rem] border-2 border-meta-accent/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-[10px] font-black text-meta-accent uppercase tracking-widest mb-1">Academic Level</h3>
                        <p className="text-2xl sm:text-3xl font-black text-white">{result.rank || 'Scholar'}</p>
                      </div>
                      <div className="text-right">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Performance Score</h3>
                        <div className="text-4xl sm:text-6xl font-black text-meta-accent">{result.score || 0}<span className="text-sm opacity-50 ml-1">/100</span></div>
                      </div>
                    </div>
                    
                    <div className={`mb-8 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block ${result.status === 'Correct' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {result.status}
                    </div>
                    
                    <p className="text-lg sm:text-xl font-bold text-slate-300 leading-relaxed italic">"{result.feedback}"</p>
                  </div>

                  {/* Linguistic Diagnostics Breakdown */}
                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] px-4">Linguistic Diagnostic Breakdown</h4>
                    {result.matches.map((m: any, idx: number) => (
                      <div key={idx} className={`p-6 sm:p-10 glass-premium rounded-[2rem] sm:rounded-[3.5rem] border border-white/5 space-y-8`}>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exercise #{idx+1}</p>
                          <span className={m.isCorrect ? 'text-emerald-400 text-[10px] font-black' : 'text-rose-400 text-[10px] font-black'}>
                            {m.isCorrect ? '✓ VALIDATED' : '✕ NEEDS CORRECTION'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest opacity-50">Question</p>
                          <p className="text-xl font-black text-white">{m.question}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Your Original Submission</p>
                             <p className="text-base font-bold text-slate-300 italic">"{m.answer || 'No text detected'}"</p>
                           </div>
                           
                           <div className="p-6 bg-meta-accent/10 rounded-2xl border border-meta-accent/20">
                             <p className="text-[9px] font-black text-meta-accent uppercase tracking-widest mb-4">Neural Refinement (Academic)</p>
                             <p className="text-base font-black text-white leading-relaxed">{m.improvedAnswer}</p>
                           </div>
                        </div>

                        {/* Specific Grammar Feedback */}
                        <div className="p-6 bg-rose-500/5 rounded-2xl border border-rose-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">✍️</span>
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Grammar & Syntax Diagnostic</p>
                          </div>
                          <p className="text-sm font-bold text-slate-300 leading-relaxed">{m.grammarFeedback}</p>
                        </div>

                        {/* Structural Alternatives */}
                        <div className="p-6 bg-meta-primary/5 rounded-2xl border border-meta-primary/20">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">🔄</span>
                            <p className="text-[9px] font-black text-meta-primary uppercase tracking-widest">Structural Alternatives</p>
                          </div>
                          <div className="space-y-4">
                            {m.structuralAlternatives.map((alt: string, i: number) => (
                              <div key={i} className="flex gap-4">
                                <span className="text-meta-primary opacity-50 text-xs font-black mt-1">{i + 1}.</span>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed">{alt}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject Context Feedback</p>
                           <p className="text-sm font-medium text-slate-400 leading-relaxed">{m.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HOMEWORK SOLVER VIEW */}
              {tool.id === ToolId.SOLVER && (
                <div className="p-8 sm:p-12 glass-premium rounded-[2.5rem] sm:rounded-[5rem] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-aurora"></div>
                  <div className="mb-8 sm:mb-12">
                    <h3 className="text-[10px] font-black text-meta-accent uppercase tracking-widest mb-4">The Result</h3>
                    <p className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight">{result.finalAnswer}</p>
                  </div>
                  
                  <div className="space-y-8 sm:space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Logical Sequence</h4>
                      <div className="space-y-4 sm:space-y-6">
                        {result.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-4 sm:gap-6 group">
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center shrink-0 font-black text-meta-accent text-xs sm:text-sm group-hover:bg-meta-accent group-hover:text-slate-900 transition-colors">{i+1}</span>
                            <p className="text-base sm:text-xl font-bold text-slate-300 pt-1 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 sm:p-10 bg-meta-accent/5 rounded-[2rem] sm:rounded-[3rem] border border-meta-accent/10">
                      <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-widest mb-4">Deep Explanation</h4>
                      <p className="text-base sm:text-lg font-bold text-slate-300 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generic Fallback */}
              {![ToolId.HOMEWORK_CHECK, ToolId.SOLVER].includes(tool.id as ToolId) && (
                 <div className="p-8 sm:p-12 glass-premium rounded-[2rem] sm:rounded-[4rem] border border-white/10 overflow-hidden">
                   <p className="text-xl sm:text-2xl font-black text-white whitespace-pre-wrap leading-relaxed">
                     {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                   </p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolView;
