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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

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
      onNext();
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
      className="w-full max-w-3xl mx-auto px-6 py-8 flex flex-col items-center justify-between min-h-[85vh] font-poppins relative text-white"
    >
      {/* Top Bar: Corner Fraction & Direct Slide Dots */}
      <div className="w-full flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-700 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-white shadow-md'
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Fraction in the Corner */}
        <div className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white tracking-widest shadow-md">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      {/* Main PowerPoint Presentation Body */}
      <div
        key={currentIndex}
        className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto px-2 sm:px-8 py-4 animate-powerpoint-slow relative z-10"
      >
        {/* Subtitle Accent */}
        {currentSlide.subtitle && (
          <span className="text-xs sm:text-sm font-medium tracking-[2.5px] uppercase text-rose-200/90 mb-3 inline-block drop-shadow-sm">
            {currentSlide.subtitle}
          </span>
        )}

        {/* Title */}
        {currentSlide.title && !currentSlide.beholdGrid && (
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg max-w-2xl">
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
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500/80 to-pink-600/80 border border-white/30 backdrop-blur-md font-semibold text-lg text-white shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                <span>Click to Reveal 💖</span>
              </button>
            ) : (
              <div className="px-8 py-6 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 text-2xl sm:text-3xl font-extrabold text-rose-100 shadow-2xl transition-all duration-700 ease-out transform animate-powerpoint-slow flex items-center justify-center">
                <span className="tracking-wide animate-fade-in">{currentSlide.revealText}</span>
              </div>
            )}
          </div>
        )}

        {/* Video Placeholder Container (Screens 4 & 5) */}
        {currentSlide.videoPlaceholderLabel && (
          <div className="my-6 max-w-xl mx-auto w-full">
            {currentSlide.videoUrl ? (
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <video src={currentSlide.videoUrl} controls className="w-full aspect-video object-cover" />
              </div>
            ) : (
              <div className="group relative rounded-3xl bg-black/40 backdrop-blur-md border-2 border-dashed border-rose-300/40 p-6 sm:p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-rose-300/80 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-200 group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-300/30 text-xs font-mono font-semibold text-rose-200">
                  <Play className="w-3 h-3 fill-rose-200" />
                  <span>VIDEO PLACEHOLDER</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
                  [{currentSlide.videoPlaceholderLabel}]
                </h3>
                <p className="text-xs text-white/60 max-w-sm italic">
                  (Insert your video file or link here later)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Custom Emoji Visual Spotlight (Screen 6) */}
        {currentSlide.customEmoji && (
          <div className="my-6 flex items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-6xl sm:text-7xl animate-pulse">
              <span>{currentSlide.customEmoji}</span>
            </div>
          </div>
        )}

        {/* Things That Remind Me of You — Free-Floating Anti-Gravity Canvas with Centered Title (Screen 8) */}
        {currentSlide.beholdGrid && (
          <div className="w-full relative min-h-[440px] sm:min-h-[520px] my-2 overflow-visible select-none flex items-center justify-center">
            {/* Centered Main Title (Behind Floating Emojis/Stickers) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] max-w-lg">
                {currentSlide.title || "The things that remind me of you"}
              </h1>
            </div>

            {/* 1. Blue Whales (Top-Left) */}
            <div
              className="absolute top-[-2%] left-[0%] sm:left-[4%] flex flex-col items-center vector-hover-3 z-20"
              style={{ transform: 'rotate(-10deg)' }}
            >
              <span className="text-6xl sm:text-8xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
                🐋
              </span>
              <span className="text-xs sm:text-base font-extrabold text-cyan-200 tracking-wide mt-1 drop-shadow">
                Blue Whales
              </span>
            </div>

            {/* 2. Kirby (Top-Right) */}
            <div
              className="absolute top-[-4%] right-[0%] sm:right-[4%] flex flex-col items-center vector-hover-2 z-20"
              style={{ transform: 'rotate(12deg)' }}
            >
              <img
                src="/kirby.png"
                alt="Kirby"
                className="w-20 h-20 sm:w-32 sm:h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform cursor-default"
              />
              <span className="text-xs sm:text-base font-extrabold text-pink-200 tracking-wide mt-1 drop-shadow">
                Kirby 💖
              </span>
            </div>

            {/* 3. 3.14 + Arrow & Birthday Caption (Middle-Left) */}
            <div
              className="absolute top-[46%] left-[-2%] sm:left-[1%] flex flex-col items-start vector-hover-1 z-20"
              style={{ transform: 'rotate(-14deg)' }}
            >
              <div className="flex items-center gap-1 group cursor-default">
                <span className="text-4xl sm:text-6xl font-black font-mono text-amber-200 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                  3.14
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-amber-100/90 pl-1">
                <svg className="w-5 h-5 text-amber-300 shrink-0 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-xs sm:text-base font-bold tracking-wide italic drop-shadow font-poppins">
                  My birthday btw
                </span>
              </div>
            </div>

            {/* 4. The Color Red (Middle-Right) */}
            <div
              className="absolute top-[48%] right-[-2%] sm:right-[1%] flex flex-col items-center vector-hover-1 z-20"
              style={{ transform: 'rotate(15deg)' }}
            >
              <span className="text-6xl sm:text-8xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
                🔴
              </span>
              <span className="text-xs sm:text-base font-extrabold text-rose-300 tracking-wide mt-1 drop-shadow">
                The Color Red
              </span>
            </div>

            {/* 5. Pi Symbol (Bottom-Left / Center) */}
            <div
              className="absolute bottom-[-2%] left-[12%] sm:left-[18%] flex flex-col items-center vector-hover-2 z-20"
              style={{ transform: 'rotate(8deg)' }}
            >
              <span className="text-6xl sm:text-8xl font-serif font-black text-purple-200 drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
                π
              </span>
              <span className="text-xs sm:text-base font-extrabold text-purple-200 tracking-wide mt-1 drop-shadow">
                Pi Symbol
              </span>
            </div>

            {/* 6. Bass Guitar (Bottom-Right / Center) */}
            <div
              className="absolute bottom-[-4%] right-[12%] sm:right-[18%] flex flex-col items-center vector-hover-3 z-20"
              style={{ transform: 'rotate(-12deg)' }}
            >
              <span className="text-6xl sm:text-8xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-default">
                🎸
              </span>
              <span className="text-xs sm:text-base font-extrabold text-indigo-200 tracking-wide mt-1 drop-shadow">
                Bass
              </span>
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
      <div className="w-full flex items-center justify-between gap-4 mt-8 pt-4 border-t border-white/10 relative z-10">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-poppins text-xs font-semibold transition-all duration-300 ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed text-white/40'
              : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer border border-white/20 shadow'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="btn-crimson flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-semibold shadow-2xl cursor-pointer hover:scale-105 border border-white/20"
        >
          <span>{currentIndex === slides.length - 1 ? 'Go to Question 💕' : 'Next Message'}</span>
          {currentIndex < slides.length - 1 ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <Heart className="w-4 h-4 fill-white" />
          )}
        </button>
      </div>

      {/* Back to Quiz link */}
      {onBackToQuiz && (
        <div className="mt-4 text-center">
          <button
            onClick={onBackToQuiz}
            className="text-xs text-white/60 hover:text-white underline cursor-pointer font-poppins transition-colors"
          >
            ← Return to verification check
          </button>
        </div>
      )}
    </div>
  );
};

export default SlideViewer;
