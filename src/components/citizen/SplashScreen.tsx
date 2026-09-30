import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-progress after 3.5s if not manually clicked
      onFinish();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative min-h-full flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#1E5622] via-[#2E7D32] to-[#144218] text-white overflow-hidden">
      {/* Background ambient circular rings */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/10 pointer-events-none" />

      {/* Top spacer with subtle civic emblem */}
      <div className="pt-6 flex flex-col items-center z-10">
        <span className="text-[11px] tracking-widest uppercase font-semibold text-emerald-200/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
          Municipal Smart Civic Platform
        </span>
      </div>

      {/* Center hero illustration & brand */}
      <div className="flex flex-col items-center text-center z-10 px-4 my-auto">
        <div className="relative mb-6">
          <div className="w-52 h-52 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-white/10 flex items-center justify-center p-2">
            <img
              src="/src/assets/images/splash_illustration_1790741375177.jpg"
              alt="Smart Waste Management Illustration"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Graceful fallback if asset failed
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-3 -right-3 bg-white text-[#2E7D32] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-bold text-xs ring-2 ring-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Eco Smart 2026</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          Smart Waste Management
        </h1>
        <p className="text-emerald-100 font-medium text-sm tracking-wide mb-6">
          “Clean City, Green City”
        </p>

        {/* Loading Spinner / Progress indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[11px] text-emerald-200/80 font-mono tracking-tight">
            Initializing civic network...
          </span>
        </div>
      </div>

      {/* Skip / Continue button */}
      <div className="w-full pb-4 z-10">
        <button
          onClick={onFinish}
          className="w-full py-3 px-4 bg-white text-[#2E7D32] font-semibold text-sm rounded-2xl shadow-lg hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
