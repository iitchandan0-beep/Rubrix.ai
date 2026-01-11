
import React from 'react';

const PLANS = [
  {
    name: 'Standard',
    price: '₹0',
    description: 'Perfect for quick cognitive checks.',
    features: ['3 checks per 24h cycle', 'Limited neural solver', 'Public data access', 'Standard latency'],
    cta: 'Initialize',
    color: 'bg-white/5 border-white/10'
  },
  {
    name: 'Neural Lite',
    price: '₹49',
    period: '/month',
    description: 'Optimized for active researchers.',
    features: ['20 checks per cycle', 'Extended solver modules', 'Handwritten cleaning engine', 'Prioritized queue'],
    cta: 'Upgrade Sync',
    popular: true,
    color: 'bg-meta-primary/10 border-meta-accent/30 ring-1 ring-meta-accent/20'
  },
  {
    name: 'Neural Pro',
    price: '₹99',
    period: '/month',
    description: 'Full potential academic weapon.',
    features: ['Unlimited checks', 'Deep-reasoning solver', 'AI signal detection', 'Mistake diagnostic suite', 'Zero latency'],
    cta: 'Full Access',
    color: 'bg-white/5 border-white/10'
  },
  {
    name: 'Council Elite',
    price: '₹149',
    period: '/month',
    description: 'The ultimate research engine.',
    features: ['Predictive analytics', 'Hard-level simulation', 'Neural PDF reports', 'Expert council hints', 'Beta module access'],
    cta: 'Join Elite',
    color: 'bg-meta-accent/10 border-meta-accent/50 text-white'
  }
];

const PricingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-meta-primary/5 glow-sphere rounded-full pointer-events-none"></div>

      <div className="text-center mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 bg-meta-accent/10 text-meta-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-meta-accent/20">
          Neural Subscriptions
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Choose Your <span className="text-aurora">Sequence</span>.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-bold max-w-xl mx-auto tracking-tight">Sync with the Rubrix Archive at a level that matches your academic mission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {PLANS.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative flex flex-col p-10 rounded-[3rem] border backdrop-blur-xl transition-all hover:scale-[1.02] duration-500 ${plan.color} ${plan.popular ? 'shadow-[0_0_50px_rgba(0,210,255,0.15)]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-meta-accent text-slate-900 text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                Recommended
              </div>
            )}
            
            <h3 className={`text-2xl font-black mb-6 tracking-tight ${plan.name === 'Council Elite' ? 'text-meta-accent' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
            
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</span>
              <span className={`text-xs font-black uppercase tracking-widest opacity-60`}>{plan.period}</span>
            </div>
            
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">{plan.description}</p>
            
            <div className="flex-grow space-y-5 mb-12">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-meta-accent/20 text-meta-accent flex items-center justify-center text-[10px] mt-0.5">✓</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
              plan.name === 'Council Elite' 
                ? 'bg-white text-meta-bg hover:bg-meta-accent' 
                : plan.popular 
                  ? 'bg-meta-accent text-meta-bg hover:brightness-110' 
                  : 'bg-white/10 text-slate-900 dark:text-white hover:bg-white/20'
            }`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
