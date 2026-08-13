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
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg max-w-2xl">
          {currentSlide.title}
        </h1>

        {/* Content Paragraph */}
        {currentSlide.content && (
          <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl font-light mb-6 drop-shadow">
            {currentSlide.content}
          </p>
        )}

        {/* Interactive Reveal Component (Screen 1) */}
        {currentSlide.revealText && (
          <div className="my-4 max-w-md mx-auto w-full">
            {!isRevealed ? (
              <button
                onClick={() => setIsRevealed(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500/80 to-pink-600/80 border border-white/30 backdrop-blur-md font-semibold text-lg text-white shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                <span>Click to Reveal 💖</span>
              </button>
            ) : (
              <div className="px-8 py-6 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 text-2xl sm:text-3xl font-extrabold text-rose-100 shadow-2xl animate-fade-in flex items-center justify-center gap-3">
                <Heart className="w-8 h-8 fill-rose-400 text-rose-300 animate-bounce" />
                <span>{currentSlide.revealText}</span>
                <Heart className="w-8 h-8 fill-rose-400 text-rose-300 animate-bounce" />
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

        {/* Things That Remind Me of You Visual Grid (Screen 8) */}
        {currentSlide.beholdGrid && (
          <div className="my-6 w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {currentSlide.beholdGrid.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${item.color || 'from-white/10 to-white/5'} backdrop-blur-md border border-white/20 flex flex-col items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 cursor-default group`}
                >
                  <span className="text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-300">
                    {item.symbol}
                  </span>
                  <span className="text-sm font-semibold text-white tracking-wide">
                    {item.label}
                  </span>
                </div>
              ))}
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
