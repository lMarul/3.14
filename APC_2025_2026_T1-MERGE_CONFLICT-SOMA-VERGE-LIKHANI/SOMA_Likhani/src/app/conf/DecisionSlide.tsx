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
  const [dodgeCount, setDodgeCount] = useState(0);
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

  const triggerDodge = () => {
    if (!evasiveEnabled) return;
    if (dodgeCount >= 5) return; // Stop dodging after 5 times

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    if (nextCount >= 5) {
      // Return to original position once 5 dodges complete so it doesn't overlap text
      setNoPosition({ x: 0, y: 0 });
      setHasDodged(false);
      return;
    }

    // Moves the button outside the white card while keeping it fully visible on screen
    const maxOffsetX = Math.min(window.innerWidth / 2 - 100, 220);
    const maxOffsetY = Math.min(window.innerHeight / 3, 130);

    const randomX = (Math.random() > 0.5 ? 1 : -1) * (110 + Math.random() * Math.max(20, maxOffsetX - 110));
    const randomY = (Math.random() - 0.5) * maxOffsetY * 2;

    setNoPosition({ x: randomX, y: randomY });
    setHasDodged(true);
  };

  const handleNoClick = () => {
    if (dodgeCount < 5 && evasiveEnabled) {
      triggerDodge();
      return;
    }

    // Return button to default position when prompts are triggered
    setNoPosition({ x: 0, y: 0 });
    setHasDodged(false);

    // Once dodgeCount >= 5 and clickable, cycle through playful prompts
    if (playfulPromptIndex === null) {
      setPlayfulPromptIndex(0);
    } else if (playfulPromptIndex < playfulPrompts.length - 1) {
      setPlayfulPromptIndex(prev => (prev !== null ? prev + 1 : 0));
    } else {
      onSelectNo();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh] relative z-20 animate-powerpoint-slow">
      <div
        ref={containerRef}
        style={{ overflow: 'visible' }}
        className="w-full sentimental-card p-6 sm:p-10 text-center relative shadow-2xl border border-[#E5E7EB] !overflow-visible"
      >
        {/* Coffee Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#8A181A] flex items-center justify-center shadow-lg mb-6">
          <Coffee className="w-8 h-8 text-white" />
        </div>

        {/* Question Heading */}
        <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101828] mb-4 leading-tight">
          {questionText}
        </h2>

        <p className="font-poppins text-[#4A5565] text-sm sm:text-base mb-6 max-w-md mx-auto">
          Dear <span className="font-semibold text-[#101828]">{recipientName}</span>, I'd love to share a quiet coffee moment together. What do you say?
        </p>

        {/* Playful Prompt Banner */}
        {playfulPromptIndex !== null && (
          <div className="mb-6 p-4 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] text-[#4A5565] text-xs font-poppins animate-fade-in">
            <p className="font-medium text-[#8A181A]">{playfulPrompts[playfulPromptIndex]}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative min-h-[100px] flex flex-col sm:flex-row items-center justify-center gap-4 mt-4" style={{ overflow: 'visible' }}>
          {/* YES Button */}
          <button
            onClick={handleYesClick}
            className="btn-crimson w-full sm:w-auto min-w-[200px] px-8 py-4 text-base font-semibold flex items-center justify-center gap-2 cursor-pointer z-10"
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Yes, I'd love to! ☕💖</span>
          </button>

          {/* NO Button (Evasive) */}
          <button
            onClick={handleNoClick}
            onMouseEnter={triggerDodge}
            onTouchStart={triggerDodge}
            style={{
              transform: evasiveEnabled && hasDodged ? `translate(${noPosition.x}px, ${noPosition.y}px)` : 'none',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className={`pill-inactive w-full sm:w-auto min-w-[140px] px-6 py-3.5 flex items-center justify-center gap-2 text-xs cursor-pointer z-40 relative shadow-xl ${
              dodgeCount >= 5 ? 'ring-2 ring-rose-400 bg-white text-[#8A181A] font-bold' : ''
            }`}
          >
            <XCircle className="w-4 h-4 text-[#6A7282]" />
            <span>
              {playfulPromptIndex !== null
                ? playfulPromptIndex === playfulPrompts.length - 1
                  ? "Proceed with No"
                  : "Still No..."
                : "No, sorry..."}
            </span>
          </button>
        </div>
      </div>

      <button
        onClick={onBackToSlides}
        className="mt-6 font-poppins text-xs text-[#6A7282] hover:text-[#8A181A] underline underline-offset-4 transition-colors cursor-pointer"
      >
        ← Return to confession slides
      </button>
    </div>
  );
};
