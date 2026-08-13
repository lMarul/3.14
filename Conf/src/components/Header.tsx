import React from 'react';
import { Heart, Lock, RotateCcw } from 'lucide-react';

interface HeaderProps {
  recipientName: string;
  onOpenAdmin: () => void;
  onReset: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const Header: React.FC<HeaderProps> = ({
  recipientName,
  onOpenAdmin,
  onReset,
  currentStep,
  totalSteps,
}) => {
  return (
    <header className="relative z-20 w-full px-4 py-4 md:py-6 flex items-center justify-between max-w-4xl mx-auto">
      {/* Brand Title */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
        <div className="w-9 h-9 rounded-full bg-rose-900/60 border border-rose-500/40 flex items-center justify-center shadow-md">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
        </div>
        <div>
          <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-rose-100">
            For {recipientName}
          </h1>
          <p className="text-[11px] text-rose-300/70 font-sans">A personal confession</p>
        </div>
      </div>

      {/* Center Step Counter if available */}
      {currentStep !== undefined && totalSteps !== undefined && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-900/80 border border-rose-500/20 text-xs text-rose-200">
          <span>Slide</span>
          <span className="font-bold text-rose-400">{currentStep}</span>
          <span>of</span>
          <span>{totalSteps}</span>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-full hover:bg-rose-900/40 text-rose-300/80 hover:text-rose-100 transition-colors"
          title="Restart from beginning"
          aria-label="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenAdmin}
          className="p-2 rounded-full hover:bg-rose-900/40 text-rose-300/80 hover:text-rose-100 transition-colors flex items-center gap-1 text-xs"
          title="Creator / Admin Panel"
          aria-label="Admin settings"
        >
          <Lock className="w-4 h-4" />
          <span className="hidden md:inline font-mono text-[11px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
