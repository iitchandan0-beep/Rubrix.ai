
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { auth } from '../firebase';

interface AuthPageProps {
  setUser: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please use a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        setUser({
          id: user?.uid || '',
          email: user?.email || '',
          name: user?.displayName || user?.email?.split('@')[0] || 'Student',
          plan: 'free'
        });
      } else {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (name && user) {
          await user.updateProfile({ displayName: name });
        }

        setUser({
          id: user?.uid || '',
          email: user?.email || '',
          name: name || user?.email?.split('@')[0] || 'Student',
          plan: 'free'
        });
      }
      navigate('/tools');
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      
      // Handle Firebase error codes specifically for better UX
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please check your credentials.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('The email address is badly formatted.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Contact support.');
          break;
        default:
          setError('An unexpected authentication error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-meta-primary/10 glow-sphere rounded-full pointer-events-none"></div>
      
      <div className="max-w-md w-full glass-premium p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] border border-white/10 relative z-10 shadow-[0_0_100px_rgba(139,92,246,0.1)]">
        <div className="text-center mb-10">
          <div className="bg-gold-glow w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-ping scale-75 opacity-20"></div>
            <span className="text-slate-900 font-black text-4xl relative z-10">R</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
            {isLogin ? 'Access the Rubrix Archive' : 'Initialize your student profile'}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isLogin ? 'bg-meta-accent text-slate-900 shadow-lg' : 'text-slate-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isLogin ? 'bg-meta-accent text-slate-900 shadow-lg' : 'text-slate-400'}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
            <p className="mb-2">{error}</p>
            {error.includes('already registered') && (
              <button 
                onClick={() => setIsLogin(true)} 
                className="underline text-[10px] uppercase tracking-widest hover:text-rose-400 transition-colors"
              >
                Switch to Login
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] px-2">Identification</label>
              <input 
                type="text" 
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-meta-accent/20 focus:border-meta-accent outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:opacity-30"
                placeholder="Full Name"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] px-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-meta-accent/20 focus:border-meta-accent outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:opacity-30"
              placeholder="registry@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-meta-accent uppercase tracking-[0.4em] px-2">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-meta-accent/20 focus:border-meta-accent outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:opacity-30"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-gold-glow text-slate-900 rounded-3xl font-black text-lg hover:brightness-110 transition-all shadow-xl active:scale-95 uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isLogin ? 'Enter Archive' : 'Register Profile'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Secured Academic Network</p>
          <p className="text-slate-400 text-xs font-bold leading-relaxed px-4">
            Only real academic or corporate emails are accepted for integrated history sync.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
