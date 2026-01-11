
import React, { useState, useRef, useEffect } from 'react';
import { CalculatorMode, CalcStep, FormulaSuggestion, User } from '../types';
import { geminiService } from '../services/geminiService';

interface AICalculatorProps {
  user: User | null;
}

const AICalculator: React.FC<AICalculatorProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CalcStep[]>([]);
  const [suggestions, setSuggestions] = useState<FormulaSuggestion[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isOCRing, setIsOCRing] = useState(false);
  const [examMode, setExamMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleCalculate = () => {
    if (!input.trim()) return;
    try {
      // Basic offline calculation for speed
      // In a real app, use math.js or similar for robust algebra
      // Here we simulate a result or use eval carefully (not recommended for production)
      const res = eval(input.replace(/[^0-9+\-*/().]/g, ''));
      const newStep: CalcStep = {
        id: Math.random().toString(36).substr(2, 9),
        expression: input,
        result: String(res)
      };
      setHistory([...history, newStep]);
      setInput('');
      fetchContextSuggestions(input);
    } catch (e) {
      alert("Invalid expression");
    }
  };

  const fetchContextSuggestions = async (context: string) => {
    if (examMode) return;
    try {
      const formulas = await geminiService.getFormulaSuggestions(context);
      setSuggestions(formulas);
    } catch (e) {
      console.error(e);
    }
  };

  const validateSteps = async () => {
    if (history.length === 0) return;
    setIsValidating(true);
    try {
      const results = await geminiService.validateCalcSteps(history);
      const newHistory = history.map((step, idx) => ({
        ...step,
        isValid: results[idx]?.isValid,
        explanation: results[idx]?.explanation,
        logicFeedback: results[idx]?.suggestedCorrection
      }));
      setHistory(newHistory);
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsOCRing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const eq = await geminiService.importEquationFromImage(reader.result as string);
        setInput(eq);
      } catch (err) {
        console.error(err);
      } finally {
        setIsOCRing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-aurora rounded-full shadow-2xl flex items-center justify-center text-3xl z-[100] hover:scale-110 active:scale-95 transition-all group"
      >
        <span className="group-hover:rotate-12 transition-transform">🧮</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-meta-accent rounded-full border-2 border-white animate-pulse"></div>
      </button>
    );
  }

  return (
    <div 
      style={{ left: position.x, top: position.y }}
      className="fixed w-80 sm:w-96 glass-premium rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.3)] z-[100] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in duration-300"
    >
      {/* Header - Drag Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-6 bg-white/5 border-b border-white/10 cursor-move flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="text-xl">🧮</div>
          <div>
            <h4 className="text-[10px] font-black text-meta-accent uppercase tracking-widest">Neural Calculator</h4>
            <p className="text-[8px] font-bold text-slate-500 uppercase">{mode} Mode • {examMode ? 'RESTRICTED' : 'AI SYNC'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setExamMode(!examMode)} title="Toggle Exam Safe Mode" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${examMode ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-400'}`}>
            🛡️
          </button>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">✕</button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex p-2 gap-1 bg-black/20">
        {(['basic', 'scientific', 'algebra'] as CalculatorMode[]).map(m => (
          <button 
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-meta-accent text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* History/Log Area */}
      <div className="flex-1 max-h-64 overflow-y-auto p-4 space-y-3 bg-white/2 backdrop-blur-md">
        {history.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-slate-600 text-[10px] font-black uppercase tracking-widest">Ready for input</div>
        ) : (
          history.map((step, i) => (
            <div key={step.id} className="group animate-in slide-in-from-left duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Step {i+1}</div>
                  <div className="text-sm font-black text-white">{step.expression}</div>
                  <div className="text-lg font-black text-meta-accent">= {step.result}</div>
                </div>
                {step.isValid !== undefined && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {step.isValid ? '✓' : '✕'}
                  </div>
                )}
              </div>
              {step.explanation && (
                <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10 text-[9px] font-bold text-slate-400 leading-tight">
                  {step.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Formula Suggestions Bar */}
      {!examMode && suggestions.length > 0 && (
        <div className="p-3 bg-meta-primary/10 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setInput(s.formula)}
              className="shrink-0 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-white hover:bg-meta-primary/20 transition-all whitespace-nowrap"
              title={s.reason}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 space-y-3 bg-white/5 border-t border-white/10">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Enter equation..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:ring-2 focus:ring-meta-accent/50"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isOCRing}
            className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {isOCRing ? '...' : '📸'}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleOCR} accept="image/*" className="hidden" />
        </div>

        {/* Numpad/Scientific controls depending on mode - Abstracted for space */}
        <div className="grid grid-cols-4 gap-2">
          {['+', '-', '*', '/', '(', ')', '^', 'AC'].map(op => (
            <button 
              key={op}
              onClick={() => op === 'AC' ? (setHistory([]), setInput('')) : setInput(input + op)}
              className="py-2 bg-white/5 rounded-lg text-xs font-black text-slate-300 hover:bg-white/10"
            >
              {op}
            </button>
          ))}
          <button 
            onClick={handleCalculate}
            className="col-span-2 py-3 bg-aurora text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95"
          >
            EXECUTE
          </button>
          <button 
            onClick={validateSteps}
            disabled={isValidating || examMode}
            className={`col-span-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${examMode ? 'bg-slate-800 text-slate-600' : 'bg-meta-accent text-slate-900 hover:brightness-110'}`}
          >
            {isValidating ? 'VALIDATING...' : 'AI VALIDATE'}
          </button>
        </div>
      </div>
      
      {/* Partial Marking / Eval Link */}
      <div className="px-4 py-3 bg-gold-glow/10 border-t border-gold-glow/20 flex items-center justify-between">
        <span className="text-[8px] font-black text-meta-gold uppercase tracking-widest">Rubric Evaluation Sync</span>
        <button 
          onClick={() => alert("Syncing steps to evaluation engine...")}
          className="text-[8px] font-black text-white bg-meta-gold/20 px-2 py-1 rounded border border-meta-gold/30 uppercase tracking-widest hover:bg-meta-gold/40"
        >
          Push to Check
        </button>
      </div>
    </div>
  );
};

export default AICalculator;
