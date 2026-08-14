import React, { useEffect, useState, useRef } from 'react';
import type { Slide } from './types';
import { ChevronLeft, ChevronRight, Heart, Quote, Play, Film, Sparkles } from 'lucide-react';

interface SlideViewerProps {
  slides: Slide[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectSlide: (index: number) => void;
  onBackToQuiz?: () => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  currentIndex,
  onNext,
  onPrev,
  onSelectSlide,
  onBackToQuiz,
}) => {
  const currentSlide = slides[currentIndex] || slides[0];
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset reveal state when slide changes
  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex]);

  const handleNextWithCheck = () => {
    if (currentSlide.revealText && !isRevealed) return;
    onNext();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNextWithCheck();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, isRevealed, currentSlide.revealText]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      handleNextWithCheck();
    } else if (distance < -50) {
      onPrev();
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex flex-col items-center justify-between h-full max-h-[92vh] font-poppins relative text-white"
    >
      {/* Top Bar: Corner Fraction & Direct Slide Dots */}
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSlide(idx)}
              className={`h-2 rounded-full transition-all duration-700 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Fraction in the Corner */}
        <div className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white tracking-widest shadow-md">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      {/* Main PowerPoint Presentation Body */}
      <div
        key={currentIndex}
        className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto px-2 sm:px-6 py-2 animate-powerpoint-slow relative z-10"
      >
        {/* Subtitle Accent */}
        {currentSlide.subtitle && (
          <span className="text-xs font-medium tracking-[2.5px] uppercase text-rose-200/90 mb-2 inline-block drop-shadow-sm">
            {currentSlide.subtitle}
          </span>
        )}

        {/* Title */}
        {currentSlide.title && !currentSlide.beholdGrid && (
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-lg max-w-2xl">
            {currentSlide.title}
          </h1>
        )}

        {/* Content Paragraph / Message */}
        {currentSlide.content && (
          <p className={`${currentSlide.title ? 'text-base sm:text-xl font-light text-white/90 mb-6' : 'text-xl sm:text-3xl font-medium text-white/95 mb-8 leading-snug'} max-w-2xl leading-relaxed drop-shadow-md`}>
            {currentSlide.content}
          </p>
        )}

        {/* Interactive Reveal Component (Screen 1) */}
        {currentSlide.revealText && (
          <div className="my-4 max-w-md mx-auto w-full">
            {!isRevealed ? (
              <button
                onClick={() => setIsRevealed(true)}
                className="px-8 py-4 rounded-2xl bg-[#8A181A] hover:bg-[#731416] border border-white/20 font-semibold text-lg text-white shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <span>Click to Reveal</span>
              </button>
            ) : (
              <div className="px-8 py-6 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 text-2xl sm:text-3xl font-extrabold text-rose-100 shadow-2xl transition-all duration-700 ease-out transform animate-powerpoint-slow flex items-center justify-center">
                <span className="tracking-wide animate-fade-in">{currentSlide.revealText}</span>
              </div>
            )}
          </div>
        )}



        {/* Things That Remind Me of You — Hexagonal Floating Anti-Gravity Canvas with Centered Title (Screen 8) */}
        {currentSlide.beholdGrid && (
          <div className="w-full relative min-h-[460px] sm:min-h-[520px] my-1 overflow-visible select-none flex items-center justify-center">
            {/* Centered Main Title (Hexagon Core) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6 text-center animate-burst-center-title">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] max-w-xs sm:max-w-md">
                {currentSlide.title || "The things that remind me of you"}
              </h1>
            </div>

            {/* 1. Top-Center / Top-Left Vertex: Blue Whales (300°) */}
            <div className="absolute top-[2%] left-[16%] sm:left-[22%] z-20 animate-burst-top-left">
              <div className="flex flex-col items-center vector-hover-1">
                <span className="text-5xl sm:text-7xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-125 transition-transform cursor-default">
                  🐋
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-cyan-200 tracking-wide mt-0.5 drop-shadow whitespace-nowrap">
                  Blue Whales
                </span>
              </div>
            </div>

            {/* 2. Top-Center / Top-Right Vertex: Kirby (60°) */}
            <div className="absolute top-[0%] right-[16%] sm:right-[22%] z-20 animate-burst-top-right">
              <div className="flex flex-col items-center vector-hover-2">
                <img
                  src="/kirby.png"
                  alt="Kirby"
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:scale-125 transition-transform cursor-default"
                />
                <span className="text-[11px] sm:text-xs font-extrabold text-pink-200 tracking-wide mt-0.5 drop-shadow whitespace-nowrap">
                  Kirby 💖
                </span>
              </div>
            </div>

            {/* 3. Direct Far Left Vertex: 3.14 (180°) */}
            <div className="absolute top-[44%] left-[-2%] sm:left-[2%] z-20 animate-burst-middle-left">
              <div className="flex flex-col items-start vector-hover-3">
                <div className="flex items-center gap-1 group cursor-default">
                  <span className="text-3xl sm:text-5xl font-black font-mono text-amber-200 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform">
                    3.14
                  </span>
                </div>
                <div className="mt-0.5 text-amber-100/90 pl-0.5">
                  <span className="text-[10px] sm:text-xs font-bold tracking-wide italic drop-shadow font-poppins whitespace-nowrap">
                    (My birthday btw)
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Direct Far Right Vertex: The Color Red (0°) */}
            <div className="absolute top-[44%] right-[-2%] sm:right-[2%] z-20 animate-burst-middle-right">
              <div className="flex flex-col items-center vector-hover-1">
                <span className="text-5xl sm:text-7xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-125 transition-transform cursor-default">
                  🔴
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-rose-300 tracking-wide mt-0.5 drop-shadow whitespace-nowrap">
                  The Color Red
                </span>
              </div>
            </div>

            {/* 5. Bottom-Center / Bottom-Left Vertex: Pi Symbol (240°) */}
            <div className="absolute bottom-[2%] left-[18%] sm:left-[24%] z-20 animate-burst-bottom-left">
              <div className="flex flex-col items-center vector-hover-2">
                <span className="text-5xl sm:text-7xl font-serif font-black text-purple-200 drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-125 transition-transform cursor-default">
                  π
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-purple-200 tracking-wide mt-0.5 drop-shadow whitespace-nowrap">
                  Pi Symbol
                </span>
              </div>
            </div>

            {/* 6. Bottom-Center / Bottom-Right Vertex: Bass Guitar (120°) */}
            <div className="absolute bottom-[0%] right-[18%] sm:right-[24%] z-20 animate-burst-bottom-right">
              <div className="flex flex-col items-center vector-hover-3">
                <span className="text-5xl sm:text-7xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-125 transition-transform cursor-default">
                  🎸
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-indigo-200 tracking-wide mt-0.5 drop-shadow whitespace-nowrap">
                  Bass
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quote Callout if present */}
        {currentSlide.quote && (
          <div className="max-w-xl mx-auto my-4 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border-l-4 border-rose-300 flex items-start gap-3 text-left">
            <Quote className="w-5 h-5 text-rose-300 shrink-0 mt-1" />
            <p className="font-serif italic text-sm sm:text-base text-white/90 leading-snug">
              {currentSlide.quote}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions: Previous & Next Message Buttons */}
      <div className="w-full flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 relative z-10">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-poppins text-xs font-semibold transition-all duration-300 ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed text-white/40'
              : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer border border-white/20 shadow'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {(!currentSlide.revealText || isRevealed) && (
          <button
            onClick={handleNextWithCheck}
            className="btn-crimson flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-xl cursor-pointer hover:scale-105 border border-white/20 ml-auto"
          >
            <span>{currentIndex === slides.length - 1 ? 'Go to Question 💕' : 'Next Message'}</span>
            {currentIndex < slides.length - 1 ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4 fill-white" />
            )}
          </button>
        )}
      </div>

      {/* Back to Quiz link */}
      {onBackToQuiz && (
        <div className="mt-2 text-center">
          <button
            onClick={onBackToQuiz}
            className="text-[11px] text-white/50 hover:text-white underline cursor-pointer font-poppins transition-colors"
          >
            ← Return to verification check
          </button>
        </div>
      )}
    </div>
  );
};

export default SlideViewer;
