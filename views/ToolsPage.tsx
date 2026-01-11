
import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { User } from '../types';

interface ToolsPageProps {
  user: User | null;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ user }) => {
  const firstName = user?.name.split(' ')[0] || 'Student';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 relative">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-meta-primary/10 glow-sphere rounded-full pointer-events-none blur-[120px]"></div>
      
      <div className="mb-12 sm:mb-20 relative pt-4 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
          
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="inline-flex items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-xl px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/10 w-fit">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-meta-accent rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-meta-accent/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-meta-accent uppercase tracking-[0.4em]">System Ready</span>
              </div>

              <div className="relative">
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
                  Welcome, <br className="hidden sm:block" />
                  <span className="text-aurora drop-shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-pulse inline-block">
                    {firstName}.
                  </span>
                </h1>
              </div>

              <p className="text-lg sm:text-2xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight max-w-xl border-l-4 border-meta-accent/20 pl-4 sm:pl-6 mt-2 sm:mt-4">
                Academic status active. <br />
                <span className="text-slate-400 dark:text-slate-500 text-sm sm:text-lg opacity-80">Select a specialized module to begin.</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-premium rounded-3xl sm:rounded-[3rem] p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-meta-primary/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-aurora flex items-center justify-center text-white font-black text-xl sm:text-2xl">
                    {firstName[0]}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-meta-accent uppercase tracking-widest">Active Plan</p>
                    <p className="text-base sm:text-lg font-black text-white">{user?.plan.toUpperCase() || 'FREE'} PASS</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Mastery Progress</span>
                    <span className="text-meta-accent">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-aurora w-[84%] rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <h2 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em] sm:tracking-[0.6em] whitespace-nowrap">Study Modules</h2>
          <div className="h-px w-full bg-gradient-to-r from-white/10 via-meta-accent/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="group flex flex-col p-6 sm:p-10 glass-premium rounded-3xl sm:rounded-[3.5rem] border border-white/5 hover:border-meta-accent/40 transition-all duration-700 relative overflow-hidden h-full shadow-lg hover:shadow-2xl"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 dark:bg-white/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-4xl sm:text-5xl mb-6 sm:mb-8 shadow-inner ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                  {tool.icon}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 sm:mb-4 group-hover:text-meta-accent transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-bold mb-8 sm:mb-10 leading-relaxed tracking-tight flex-grow opacity-80">
                  {tool.description}
                </p>
                
                <div className="pt-6 sm:pt-8 border-t border-white/5 flex items-center justify-between text-meta-accent">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Initialize Module</span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-meta-accent group-hover:text-slate-900 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
