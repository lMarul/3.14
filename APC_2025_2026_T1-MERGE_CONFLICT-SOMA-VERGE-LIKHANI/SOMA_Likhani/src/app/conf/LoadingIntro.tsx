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
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] font-poppins text-center py-8 animate-slow-fade-in">
      {/* Floating Heart Icon Container (Clean, no card box) */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-white/10 border border-white/25 flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.15)] pulse-glow">
          <Heart className="w-12 h-12 text-rose-200 fill-rose-100" />
        </div>
        <div className="absolute -top-1 -right-1 p-2 rounded-full bg-white text-[#8A181A] shadow-lg">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
        Private Access Check
      </h1>
      <p className="text-sm sm:text-base text-rose-100/90 mb-10 max-w-sm font-normal leading-relaxed">
        Dedicated security verification for <span className="font-semibold text-white underline decoration-rose-300 underline-offset-4">{recipientName}</span>
      </p>

      {/* Full-width Glass Progress Bar */}
      <div className="w-full max-w-sm bg-black/25 backdrop-blur-sm rounded-full h-3.5 mb-3 overflow-hidden p-0.5 border border-white/20 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-white transition-all duration-200 ease-out shadow-[0_0_12px_rgba(255,255,255,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between w-full max-w-sm text-xs font-mono text-rose-200/80 mb-10 px-1">
        <span className="flex items-center gap-1.5">
          {isReady ? (
            <>
              <Coffee className="w-4 h-4 text-white" />
              <span className="font-semibold text-white">Ready for verification</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-rose-300" />
              <span>Initializing access check...</span>
            </>
          )}
        </span>
        <span className="font-bold text-white">{progress}%</span>
      </div>

      {/* Action Start Button */}
      <button
        onClick={onStart}
        className={`w-full max-w-sm py-4 px-8 bg-white text-[#8A181A] hover:bg-rose-50 font-bold text-base flex items-center justify-center gap-2 rounded-2xl shadow-2xl transition-all cursor-pointer ${
          !isReady ? 'opacity-90' : 'hover:scale-[1.03] active:scale-[0.98]'
        }`}
      >
        <span>{isReady ? 'Begin Identity Check' : 'Tap to Start'}</span>
      </button>
    </div>
  );
};

export default LoadingIntro;
