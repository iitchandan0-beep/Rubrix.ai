
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import ToolsPage from './views/ToolsPage';
import PricingPage from './views/PricingPage';
import AuthPage from './views/AuthPage';
import ToolView from './views/ToolView';
import Logo from './Logo';
import AICalculator from './components/AICalculator';
import { User } from './types';
import { auth } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
          plan: 'free'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-meta-bg flex items-center justify-center">
        <Logo size="lg" className="animate-pulse" />
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col selection:bg-purple-500/30 selection:text-purple-100 transition-colors duration-500">
        
        {/* Background Visual Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 glow-sphere rounded-full"></div>
           <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 glow-sphere rounded-full"></div>
        </div>

        {/* Global AI Calculator */}
        <AICalculator user={user} />

        {/* Navigation - Floating Pill Bar */}
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
          <nav className="glass-premium px-8 py-3 rounded-full flex items-center gap-8 max-w-6xl w-full justify-between shadow-2xl border border-white/10">
            <Link to="/" className="flex items-center group shrink-0">
              <Logo size="md" className="group-hover:scale-[1.02] transition-transform duration-300" />
            </Link>
            
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="hidden md:flex items-center gap-8">
                <NavLink to="/tools" className={({isActive}) => `text-[10px] font-black tracking-[0.2em] transition-all uppercase ${isActive ? 'text-meta-accent' : 'text-slate-400 hover:text-meta-accent'}`}>TOOLS</NavLink>
                <NavLink to="/pricing" className={({isActive}) => `text-[10px] font-black tracking-[0.2em] transition-all uppercase ${isActive ? 'text-meta-accent' : 'text-slate-400 hover:text-meta-accent'}`}>UPGRADE</NavLink>
              </div>
              
              <div className="h-4 w-px bg-slate-200/20 hidden md:block"></div>

              <button 
                onClick={() => setIsDark(!isDark)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-meta-gold transition-all active:scale-90"
                title="Toggle Universe Theme"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[9px] font-black text-meta-accent uppercase tracking-[0.2em]">Profile</span>
                    <span className="text-xs font-black text-slate-400 dark:text-white truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={handleSignOut} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="bg-gold-glow text-slate-900 px-8 py-2.5 rounded-full font-black text-[10px] tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 uppercase whitespace-nowrap">
                  Access Portal
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Spacer for Floating Nav */}
        <div className="h-28"></div>

        {/* Content */}
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolsPage user={user} />} />
            <Route path="/tools/:toolId" element={<ToolView user={user} />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          </Routes>
        </main>

        <footer className="bg-transparent py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="opacity-20 hover:opacity-100 transition-all duration-700 cursor-pointer mb-8 scale-75 grayscale hover:grayscale-0">
              <Logo size="lg" />
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-tight mb-2">Developed for the next generation of academic excellence.</p>
            <p className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">© 2025 Rubrix • Integrated Academic Systems</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
