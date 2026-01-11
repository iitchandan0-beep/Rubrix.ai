
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const LandingPage: React.FC = () => {
  const [isCheckVisible, setIsCheckVisible] = useState(false);
  const [isSolverVisible, setIsSolverVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const checkRef = useRef<HTMLDivElement>(null);
  const solverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === checkRef.current) {
            setIsCheckVisible(entry.isIntersecting);
          }
          if (entry.target === solverRef.current) {
            setIsSolverVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (checkRef.current) observer.observe(checkRef.current);
    if (solverRef.current) observer.observe(solverRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-transparent">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 sm:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Parallax Background Glows */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 glow-sphere rounded-full pointer-events-none transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-600/10 glow-sphere rounded-full pointer-events-none transition-transform duration-500 ease-out animate-drift"
          style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-purple-500/10 px-4 sm:px-6 py-2 rounded-full border border-purple-500/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shadow-sm">
               <span className="w-2 h-2 bg-meta-accent rounded-full animate-pulse"></span>
               <span className="text-[9px] sm:text-[10px] font-black text-meta-accent uppercase tracking-[0.4em]">Academic Intelligence Suite</span>
            </div>
            
            <div className="flex justify-center mb-8 sm:mb-12 animate-in fade-in zoom-in duration-1000 animate-hero-logo">
              <Logo size="lg" showText={false} className="sm:h-48 drop-shadow-[0_0_60px_rgba(139,92,246,0.4)]" />
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 sm:mb-10 leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both px-2">
              Check. Solve. <br />
              <span className="text-aurora drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]">Master</span>.
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold mb-10 sm:mb-12 leading-relaxed tracking-tight max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both px-4">
              The only AI suite designed to help you understand your mistakes and master your subjects.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both px-8 sm:px-0">
              <Link to="/auth" className="px-10 py-5 sm:px-14 sm:py-6 bg-aurora text-white rounded-full font-black text-lg sm:text-xl hover:scale-110 hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.4)] text-center">
                ACCESS NOW
              </Link>
              <Link to="/tools" className="px-10 py-5 sm:px-14 sm:py-6 bg-white/5 text-slate-900 dark:text-white border-2 border-slate-200/20 rounded-full font-black text-lg sm:text-xl hover:border-meta-accent/50 hover:bg-white/10 transition-all shadow-sm backdrop-blur-md text-center">
                VIEW TOOLS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bento Grid */}
      <section className="py-12 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 sm:gap-8 h-auto lg:h-[850px]">
            
            {/* Homework Check Card */}
            <div 
              ref={checkRef}
              className={`md:col-span-2 md:row-span-2 glass-premium rounded-3xl sm:rounded-[4rem] p-8 sm:p-12 relative overflow-hidden group transition-all duration-1000 ${isCheckVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 z-20"></div>
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden">
                 <div className={`w-[95%] h-[75%] sm:h-[80%] transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) transform ${isCheckVisible ? 'translate-y-16 rotate-[-1deg] scale-100 opacity-100' : 'translate-y-full rotate-0 scale-90 opacity-0'}`}>
                    <div className="w-full h-full bg-[#fdfbf7] rounded-t-[2.5rem] sm:rounded-t-[4rem] border-x-4 border-t-4 border-slate-200 shadow-[0_-20px_100px_rgba(0,0,0,0.15)] relative p-6 sm:p-12">
                       <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 font-black text-xl sm:text-3xl rotate-[15deg]">A+</div>
                       </div>
                       <div className="space-y-8 sm:space-y-12">
                          <div className="relative">
                             <div className="text-slate-400 text-[10px] font-black uppercase mb-2 opacity-40">Problem 01</div>
                             <div className="font-['Cursive'] text-xl sm:text-3xl text-blue-800 leading-relaxed italic" style={{ fontFamily: 'cursive' }}>
                                Limit as x → 2...
                             </div>
                             <div className="mt-2 flex items-center gap-2">
                                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Correct</span>
                             </div>
                          </div>
                          <div className="relative">
                             <div className="text-slate-400 text-[10px] font-black uppercase mb-2 opacity-40">Problem 02</div>
                             <div className="font-['Cursive'] text-xl sm:text-3xl text-blue-800 leading-relaxed italic" style={{ fontFamily: 'cursive' }}>
                                Solubility...
                             </div>
                             <div className="mt-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Correction</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="relative z-10 max-w-[280px] sm:max-w-xs">
                 <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">Homework Check</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-bold leading-relaxed mb-8">
                    Scan your handwriting and see exactly where you went wrong with visual overlays.
                 </p>
                 <Link 
                   to="/tools/homework-check" 
                   className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-emerald-500 text-white rounded-2xl font-black tracking-widest uppercase text-[10px] hover:scale-110 active:scale-95 transition-all shadow-xl"
                 >
                   CHECK YOUR WORK →
                 </Link>
               </div>
            </div>

            {/* Homework Helper Card - Optimized text placement and graphic clearing */}
            <div 
              ref={solverRef}
              className={`md:col-span-2 bg-aurora text-white rounded-3xl sm:rounded-[4rem] pl-4 sm:pl-8 pt-4 sm:pt-8 pr-6 sm:pr-10 pb-8 sm:pb-12 relative overflow-hidden group shadow-2xl transition-all duration-1000 delay-200 ${isSolverVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
               {/* Decorative Graphic - Pushed further right and down to clear text space */}
               <div className="absolute right-[-18%] sm:right-[-12%] bottom-[-15%] sm:bottom-[-10%] w-[60%] h-[90%] pointer-events-none transition-all duration-1000 transform"
                    style={{ transform: isSolverVisible ? 'translate(0, 0) rotate(-4deg)' : 'translate(60%, 60%) rotate(15deg)', opacity: isSolverVisible ? 1 : 0 }}>
                  <div className="w-full h-full bg-slate-900 rounded-[3.5rem] shadow-[-30px_30px_120px_rgba(0,0,0,0.6)] border-[10px] border-slate-800 p-8 flex flex-col gap-6">
                      <div className="w-12 h-12 bg-aurora rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">🧠</div>
                      <div className="space-y-4">
                        <div className="h-3 bg-white/10 rounded-full w-4/5"></div>
                        <div className="h-3 bg-white/10 rounded-full w-full"></div>
                        <div className="h-3 bg-white/10 rounded-full w-3/5"></div>
                      </div>
                      <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                         <div className="text-[10px] font-black text-meta-accent uppercase mb-2 tracking-[0.2em]">Sequence 01</div>
                         <div className="text-lg font-black leading-tight">Apply neural logic...</div>
                      </div>
                  </div>
               </div>
               
               {/* Text Container - Moved left (via parent pl) and higher up (via pt) and narrowed to avoid touch */}
               <div className="relative z-10 max-w-[190px] sm:max-w-[280px]">
                 <h3 className="text-4xl sm:text-5xl font-black mb-4 sm:mb-6 tracking-tighter leading-none">Homework Helper</h3>
                 <p className="text-white font-bold text-lg sm:text-xl mb-10 sm:mb-12 leading-tight tracking-tight opacity-90">
                    Get deep reasoning for any problem with step-by-step logic.
                 </p>
                 <Link to="/tools/solver" className="px-10 py-4 sm:px-12 sm:py-5 bg-white text-meta-primary rounded-2xl font-black text-[11px] tracking-[0.3em] uppercase shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all inline-block">
                    START SOLVING
                 </Link>
               </div>
            </div>
            
            <div className={`md:col-span-1 bg-meta-card text-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 flex flex-col justify-between group hover:bg-meta-primary transition-all duration-700 delay-400 border border-white/5 relative overflow-hidden ${isSolverVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
               <div className="absolute inset-0 bg-gradient-to-br from-meta-primary/20 to-transparent"></div>
               <div className="text-4xl group-hover:scale-125 group-hover:-rotate-6 transition-transform relative z-10">📊</div>
               <div className="relative z-10">
                 <h4 className="font-black text-xl">Mistake Tracker</h4>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Growth Stats</p>
               </div>
               <Link to="/tools/mistakes" className="relative z-10 text-meta-accent font-black text-[10px] tracking-widest hover:text-white transition-colors">CHECK NOW</Link>
            </div>

            <div className={`md:col-span-1 bg-white/5 dark:bg-meta-accent/10 text-slate-900 dark:text-meta-accent rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 flex flex-col justify-between border border-meta-accent/20 group hover:bg-white transition-all duration-700 delay-500 relative overflow-hidden ${isSolverVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
               <div className="text-4xl group-hover:rotate-12 transition-transform relative z-10">🤖</div>
               <div className="relative z-10">
                 <h4 className="font-black text-xl dark:text-white">AI Detection</h4>
                 <p className="text-meta-accent text-[10px] font-black uppercase tracking-widest mt-1">Check Quality</p>
               </div>
               <Link to="/tools/ai-detection" className="relative z-10 text-slate-800 dark:text-white font-black text-[10px] tracking-widest hover:text-meta-accent transition-colors">VERIFY SOURCE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/5 backdrop-blur-sm py-12 sm:py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
          <div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">98%</div>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Accuracy</p>
          </div>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">15k+</div>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Active Students</p>
          </div>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">200ms</div>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Latency</p>
          </div>
          <div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">85+</div>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Subjects</p>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="bg-meta-card rounded-[3rem] sm:rounded-[5rem] p-12 sm:p-32 text-center relative overflow-hidden border border-white/5">
          <div className="absolute inset-0 blueprint-grid opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 sm:mb-12 tracking-tighter max-w-4xl mx-auto leading-[0.9]">
              Don't just get the answer. Build your <span className="text-aurora italic">Mind</span>.
            </h2>
            <Link to="/auth" className="bg-gold-glow text-slate-900 px-10 py-5 sm:px-12 sm:py-6 rounded-full font-black text-xl sm:text-2xl hover:scale-110 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(251,191,36,0.3)] inline-block">
              JOIN THE ACADEMY
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
