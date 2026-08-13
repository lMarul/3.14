import React, { useEffect, useState, useRef } from 'react';
import type { Slide } from './types';
import { ChevronLeft, ChevronRight, Heart, Quote } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="w-full max-w-3xl mx-auto px-6 py-8 flex flex-col items-center justify-between min-h-[80vh] font-poppins relative text-white"
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

      {/* Main PowerPoint Presentation Body — Focus on Text & Message (No White Card) */}
      <div
        key={currentIndex}
        className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto px-2 sm:px-8 py-4 animate-powerpoint-slow relative z-10"
      >
        {/* Subtitle Accent */}
        {currentSlide.subtitle && (
          <span className="text-xs sm:text-sm font-medium tracking-[2.5px] uppercase text-rose-200/90 mb-4 inline-block drop-shadow-sm">
            {currentSlide.subtitle}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg max-w-2xl">
          {currentSlide.title}
        </h1>

        {/* Content Paragraph */}
        <p className="text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl font-light mb-8 drop-shadow">
          {currentSlide.content}
        </p>

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
