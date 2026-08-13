import React from 'react';
import { Heart, Lock, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  recipientName: string;
  onReset: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const Header: React.FC<HeaderProps> = ({
  recipientName,
  onReset,
  currentStep,
  totalSteps,
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative z-20 w-full px-4 py-4 md:py-6 flex items-center justify-between max-w-4xl mx-auto font-poppins">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:text-[#ff4b4b] shadow-sm transition-all cursor-pointer"
          title="Back to Likhani Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Brand Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
          <div className="w-9 h-9 rounded-full bg-[#8A181A] border border-white/20 flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white/40" />
          </div>
          <div>
            <h1 className="font-poppins text-lg md:text-xl font-bold tracking-wide text-white drop-shadow-md">
              For {recipientName}
            </h1>
            <p className="text-[11px] text-white/70 font-sans">A personal confession</p>
          </div>
        </div>
      </div>

      {/* Center Step Counter if available */}
      {currentStep !== undefined && totalSteps !== undefined && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
          <span>Slide</span>
          <span className="font-bold text-[#ff4b4b]">{currentStep}</span>
          <span>of</span>
          <span>{totalSteps}</span>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:text-[#ff4b4b] transition-colors cursor-pointer shadow-sm"
          title="Restart from beginning"
          aria-label="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/conf/admin')}
          className="p-2 px-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:text-[#ff4b4b] transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-sm font-semibold"
          title="Conf Admin Panel (/conf/admin)"
          aria-label="Admin settings"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-mono text-[11px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
