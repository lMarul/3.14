import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Coffee, Lock } from 'lucide-react';

interface LoadingIntroProps {
  recipientName?: string;
  onStart: () => void;
}

export const LoadingIntro: React.FC<LoadingIntroProps> = ({ recipientName = 'Pia', onStart }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh] font-poppins animate-slide-fade">
      {/* Sentimental Glass Card */}
      <div className="w-full bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 text-center relative overflow-hidden flex flex-col items-center">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8A181A] via-rose-400 to-[#8A181A]" />

        {/* Floating Heart Icon Container */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-inner pulse-glow">
            <Heart className="w-10 h-10 text-[#8A181A] fill-[#8A181A]" />
          </div>
          <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[#8A181A] text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] mb-2 tracking-tight">
          Confession Note
        </h1>
        <p className="text-xs sm:text-sm text-[#4A5565] mb-6 max-w-xs font-normal">
          Crafted with care just for <span className="font-semibold text-[#8A181A]">{recipientName}</span> 💕
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#F3F4F6] rounded-full h-3 mb-3 overflow-hidden p-0.5 border border-[#E5E7EB]">
          <div
            className="h-full rounded-full progress-shimmer transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#6A7282] mb-8 px-1">
          <span className="flex items-center gap-1">
            {isReady ? (
              <>
                <Coffee className="w-3.5 h-3.5 text-[#8A181A]" />
                <span>Ready to open</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Preparing confession...</span>
              </>
            )}
          </span>
          <span className="font-bold text-[#8A181A]">{progress}%</span>
        </div>

        {/* Action Start Button */}
        <button
          onClick={onStart}
          className={`w-full py-4 px-6 btn-crimson text-sm sm:text-base flex items-center justify-center gap-2 rounded-2xl shadow-xl transition-all cursor-pointer ${
            !isReady ? 'opacity-95' : 'hover:scale-[1.02]'
          }`}
        >
          <span>{isReady ? 'Enter Confession Note 💕' : 'Tap to Start ✨'}</span>
        </button>
      </div>
    </div>
  );
};

export default LoadingIntro;
