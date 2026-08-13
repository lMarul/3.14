import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CongratsScreenProps {
  recipientName: string;
  onProceed: () => void;
}

export const CongratsScreen: React.FC<CongratsScreenProps> = ({ recipientName, onProceed }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Burst confetti multiple times
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8A181A', '#ff758f', '#ffffff', '#ffd166', '#4cc9f0'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8A181A', '#ff758f', '#ffffff', '#ffd166', '#4cc9f0'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#8A181A', '#ff758f', '#ffffff', '#ffd166', '#4cc9f0'],
    });

    frame();

    // Auto fade-out transition after 3.2 seconds
    const timer = setTimeout(() => {
      handleProceed();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onProceed();
    }, 800); // 800ms fade-out transition
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh] font-poppins transition-all duration-800 ${
        isFadingOut ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 animate-slide-fade'
      }`}
    >
      <div className="w-full text-center p-8 sm:p-12 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center">
        {/* Animated Badge Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-2xl pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 p-2 rounded-full bg-rose-500 text-white shadow-lg animate-bounce">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
          Yey! It’s actually you! 🎉✨
        </h1>

        <p className="text-sm sm:text-base text-white/90 max-w-md mb-8 leading-relaxed font-light drop-shadow">
          Identity verified for <span className="font-bold text-white underline underline-offset-4">{recipientName}</span>. Everything is unlocked just for you.
        </p>

        {/* Action Button */}
        <button
          onClick={handleProceed}
          className="btn-crimson py-4 px-8 text-base flex items-center gap-3 rounded-2xl shadow-2xl hover:scale-105 cursor-pointer border border-white/20"
        >
          <span>Continue to Message</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CongratsScreen;
