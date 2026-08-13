import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Coffee, XCircle } from 'lucide-react';

interface DecisionSlideProps {
  questionText: string;
  recipientName: string;
  evasiveEnabled: boolean;
  onSelectYes: () => void;
  onSelectNo: () => void;
  onBackToSlides: () => void;
}

export const DecisionSlide: React.FC<DecisionSlideProps> = ({
  questionText,
  recipientName,
  evasiveEnabled,
  onSelectYes,
  onSelectNo,
  onBackToSlides,
}) => {
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasDodged, setHasDodged] = useState(false);
  const [playfulPromptIndex, setPlayfulPromptIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const playfulPrompts = [
    "Are you super sure? 🥺",
    "What if we get your favorite pastries too? 🥐✨",
    "Wait, think about the warm coffee aroma! ☕❤️",
    "Okay... if you really want to say no, tell me in the next screen."
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8A181A', '#a4133c', '#ff758f', '#101828']
    });

    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
    }, 200);
  };

  const handleYesClick = () => {
    triggerConfetti();
    setTimeout(() => {
      onSelectYes();
    }, 400);
  };

  const handleNoMouseEnter = () => {
    if (!evasiveEnabled) return;

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const maxX = containerRect.width / 2 - 80;
      const maxY = containerRect.height / 3;

      const randomX = (Math.random() - 0.5) * maxX * 1.5;
      const randomY = (Math.random() - 0.5) * maxY * 1.5;

      setNoPosition({ x: randomX, y: randomY });
      setHasDodged(true);
    }
  };

  const handleNoClick = () => {
    if (playfulPromptIndex === null) {
      setPlayfulPromptIndex(0);
    } else if (playfulPromptIndex < playfulPrompts.length - 1) {
      setPlayfulPromptIndex(prev => (prev !== null ? prev + 1 : 0));
    } else {
      onSelectNo();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh]">
      <div
        ref={containerRef}
        className="w-full sentimental-card p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl border border-[#E5E7EB]"
      >
        {/* Coffee Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#8A181A] flex items-center justify-center shadow-lg mb-6">
          <Coffee className="w-8 h-8 text-white" />
        </div>

        <span className="font-poppins font-bold text-[10px] tracking-[1.6px] uppercase text-[#8A181A] bg-[#8A181A]/10 px-3 py-1 rounded-full mb-4 inline-block">
          The Heart of the Matter
        </span>

        {/* Question Heading */}
        <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101828] mb-4 leading-tight">
          {questionText}
        </h2>

        <p className="font-poppins text-[#4A5565] text-sm sm:text-base mb-8 max-w-md mx-auto">
          Dear <span className="font-semibold text-[#101828]">{recipientName}</span>, I'd love to share a quiet coffee moment together. What do you say?
        </p>

        {/* Playful Prompt Banner */}
        {playfulPromptIndex !== null && (
          <div className="mb-6 p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] text-[#4A5565] text-xs font-poppins animate-fade-in">
            <p className="font-medium text-[#8A181A]">{playfulPrompts[playfulPromptIndex]}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative min-h-[100px] flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          {/* YES Button */}
          <button
            onClick={handleYesClick}
            className="btn-crimson w-full sm:w-auto min-w-[200px] px-8 py-4 text-base font-semibold flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Yes, I'd love to! ☕💖</span>
          </button>

          {/* NO Button */}
          <button
            onClick={handleNoClick}
            onMouseEnter={handleNoMouseEnter}
            style={{
              transform: evasiveEnabled && hasDodged ? `translate(${noPosition.x}px, ${noPosition.y}px)` : 'none',
              transition: evasiveEnabled ? 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            }}
            className="pill-inactive w-full sm:w-auto min-w-[140px] px-6 py-3.5 flex items-center justify-center gap-2 text-xs"
          >
            <XCircle className="w-4 h-4 text-[#6A7282]" />
            <span>
              {playfulPromptIndex !== null
                ? playfulPromptIndex === playfulPrompts.length - 1
                  ? "Proceed with No"
                  : "Still No..."
                : "No, sorry... 💔"}
            </span>
          </button>
        </div>
      </div>

      <button
        onClick={onBackToSlides}
        className="mt-6 font-poppins text-xs text-[#6A7282] hover:text-[#8A181A] underline underline-offset-4 transition-colors"
      >
        ← Return to confession slides
      </button>
    </div>
  );
};
