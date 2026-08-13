import React, { useEffect, useState, useRef } from 'react';
import type { Slide } from './types';
import { ChevronLeft, ChevronRight, Heart, Coffee, Sparkles, Star, Smile, BookOpen, Quote } from 'lucide-react';

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
  const cardRef = useRef<HTMLDivElement>(null);

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

  const renderIcon = (iconName?: string) => {
    const props = { className: "w-5 h-5 text-[#8A181A]" };
    switch (iconName) {
      case 'heart':
        return <Heart {...props} className="w-5 h-5 text-[#8A181A] fill-[#8A181A]/20" />;
      case 'coffee':
        return <Coffee {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'star':
        return <Star {...props} />;
      case 'smile':
        return <Smile {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  const progressPercent = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center min-h-[75vh]">
      {/* Top Pill Navigation Bar */}
      <div className="w-full mb-6 flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSlide(idx)}
              className={idx === currentIndex ? 'pill-active px-4 py-2 text-[11px] cursor-pointer' : 'pill-inactive px-3.5 py-2 text-[11px] cursor-pointer'}
            >
              Slide 0{idx + 1}
            </button>
          ))}
        </div>

        <span className="font-poppins text-xs font-bold text-white/80 uppercase tracking-wider shrink-0">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Main Unique Sentimental Card Container */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full sentimental-card p-6 sm:p-10 relative overflow-hidden transition-all duration-300 shadow-2xl"
      >
        {/* Background Watermark Emblem */}
        <div className="absolute -right-8 -bottom-8 opacity-5 text-[#8A181A] pointer-events-none">
          <Heart className="w-64 h-64" />
        </div>

        {/* Category Badge & Progress Indicator */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB] shadow-sm">
              {renderIcon(currentSlide.iconName)}
            </div>
            <div>
              <span className="block font-poppins font-bold text-[10px] tracking-[1.6px] uppercase text-[#8A181A]">
                {currentSlide.subtitle || 'Confession Note'}
              </span>
              <span className="block font-poppins text-[11px] text-[#99A1AF]">
                Personal Memory #{currentIndex + 1}
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#F7F6F3] border border-[#E5E7EB] text-[10px] font-poppins font-bold tracking-wider text-[#6A7282] uppercase">
            {Math.round(progressPercent)}% Completed
          </div>
        </div>

        {/* Title */}
        <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101828] mb-4 leading-tight relative z-10">
          {currentSlide.title}
        </h2>

        {/* Paragraph Message Body */}
        <p className="font-poppins text-[#4A5565] text-sm sm:text-base leading-relaxed mb-6 font-normal relative z-10">
          {currentSlide.content}
        </p>

        {/* Quote Callout Box */}
        {currentSlide.quote && (
          <div className="my-6 p-4 rounded-xl bg-[#F7F6F3] border-l-4 border-[#8A181A] flex items-start gap-3 relative z-10">
            <Quote className="w-5 h-5 text-[#8A181A] shrink-0 mt-0.5" />
            <p className="font-serif italic text-sm text-[#364153] leading-snug">
              {currentSlide.quote}
            </p>
          </div>
        )}

        {/* Structured Details Metadata */}
        <div className="my-6 space-y-0 border-t border-[#F3F4F6] pt-2 relative z-10">
          <div className="metadata-row">
            <span className="metadata-label w-28 shrink-0">Crafted With</span>
            <span className="metadata-value">Sentimental Heart & Good Coffee</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label w-28 shrink-0">Chapter</span>
            <span className="metadata-value font-semibold">0{currentIndex + 1} of 0{slides.length}</span>
          </div>
        </div>

        {/* Navigation Action Controls */}
        <div className="mt-8 flex items-center justify-between gap-4 pt-2 relative z-10">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-poppins font-semibold text-xs transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-[#99A1AF] bg-[#F3F4F6]'
                : 'bg-[#F7F6F3] text-[#364153] hover:bg-[#E5E7EB] border border-[#D1D5DC] cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onNext}
            className="btn-crimson flex items-center gap-2 px-6 py-3 text-sm cursor-pointer"
          >
            <span>{currentIndex === slides.length - 1 ? 'Go to Question' : 'Next Message'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Return to Verification Quiz Link */}
      {onBackToQuiz && (
        <div className="mt-4 text-center">
          <button
            onClick={onBackToQuiz}
            className="text-xs text-white/80 hover:text-white underline cursor-pointer font-poppins transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <span>← Return to verification quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
