
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-24',
    xl: 'h-48',
    auto: 'h-full w-full'
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Brand Icon */}
      <div className={`${sizes[size]} aspect-square relative flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Digital Pixel Accents */}
          <rect x="28" y="5" width="6" height="6" rx="1" fill="#00d2ff" className="animate-pulse" />
          <rect x="36" y="12" width="10" height="10" rx="2" fill="#8b5cf6" />
          <rect x="52" y="8" width="6" height="6" rx="1" fill="#ec4899" />
          
          {/* Shield Base with Complex Gradient */}
          <path 
            d="M50 95C50 95 18 78 18 48V25L50 15L82 25V48C82 78 50 95 50 95Z" 
            fill="url(#shield_grad_meta)" 
          />
          
          {/* Internal Highlight for Depth */}
          <path 
            d="M50 90C50 90 24 74 24 48V30L50 21V90Z" 
            fill="white" 
            fillOpacity="0.1" 
          />

          {/* Document Content */}
          <rect x="34" y="38" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
          <rect x="34" y="46" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
          <circle cx="28" cy="39.5" r="2" fill="white" fillOpacity="0.6" />
          <circle cx="28" cy="47.5" r="2" fill="white" fillOpacity="0.6" />

          {/* The Checkmark-Feather Hybrid */}
          <path 
            d="M25 55L38 68L85 28C88 40 85 60 70 80C55 90 45 85 40 75C35 65 40 50 55 35C45 45 40 55 40 68L25 55Z" 
            fill="url(#feather_grad_meta)" 
          />
          
          {/* White Check Highlight */}
          <path 
            d="M25 55L40 70L55 45" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          <defs>
            <linearGradient id="shield_grad_meta" x1="18" y1="15" x2="82" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#00d2ff" />
            </linearGradient>
            <linearGradient id="feather_grad_meta" x1="40" y1="30" x2="85" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="1" stopColor="#fcd34d" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Rubrix
          </span>
          <span className="text-[10px] font-black text-slate-500 dark:text-meta-accent uppercase tracking-[0.2em] mt-1 opacity-90">
            Knowledge Integrated
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
