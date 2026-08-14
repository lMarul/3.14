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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset reveal state when slide changes
  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex]);

  // Slide 4 Audio Lifecycle & Timestamp Control (00:58 - 01:38)
  useEffect(() => {
    // Clear any active fade intervals
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    // Check if current slide is Slide 4 (index 3 or slide with id 4)
    const isSlide4 = currentIndex === 3 || currentSlide.id === 4;

    if (isSlide4) {
      // Initialize audio starting strictly at 58s
      const audio = new Audio('/assets/audio/ligaya.mp3');
      audioRef.current = audio;
      audio.volume = 1.0;
      audio.currentTime = 58;

      const handleTimeUpdate = () => {
        // Soft 0.5s volume fade near 97.5s - 98.0s (1:38 cutoff)
        if (audio.currentTime >= 97.5 && audio.currentTime < 98) {
          audio.volume = Math.max(0, (98 - audio.currentTime) / 0.5);
        }
        if (audio.currentTime >= 98) {
          audio.pause();
          audio.currentTime = 58;
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Slide 4 audio autoplay requires user interaction:', err);
        });
      }

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        // Soft fade down volume over 300ms on slide change
        let currentVol = audio.volume;
        fadeIntervalRef.current = setInterval(() => {
          currentVol -= 0.2;
          if (currentVol <= 0 || audio.paused) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
            audio.pause();
            audio.currentTime = 0;
            audioRef.current = null;
          } else {
            audio.volume = Math.max(0, currentVol);
          }
        }, 50);
      };
    } else {
      // Immediately stop audio if moving to any other slide
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }
  }, [currentIndex, currentSlide.id]);

  // Overall component unmount cleanup to avoid orphaned Audio objects
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

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
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center justify-between min-h-[85vh] font-poppins relative text-white"
    >
      {/* Top Bar: Direct Slide Progress Dots & Fraction */}
      <div className="w-full flex items-center justify-between mb-6 relative z-10">
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
        className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto px-2 sm:px-6 py-4 animate-powerpoint-slow relative z-10"
      >
        {/* Subtitle Accent */}
        {currentSlide.subtitle && (
          <span className="text-xs sm:text-sm font-medium tracking-[2.5px] uppercase text-rose-200/90 mb-3 inline-block drop-shadow-sm">
            {currentSlide.subtitle}
          </span>
        )}

        {/* Title (Hidden on Slide 8 so the centered title behind floating elements takes center stage) */}
        {currentSlide.title && !currentSlide.beholdGrid && (
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg max-w-2xl">
            {currentSlide.title}
          </h1>
        )}

        {/* Content Paragraph / Message (Shown on slides other than Slide 4, 5, 8 which have custom floating layouts) */}
        {currentSlide.content && currentIndex !== 3 && currentIndex !== 4 && !currentSlide.beholdGrid && (
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

        {/* Slide 4: 2 Floating Videos on Upper Left & Upper Right of the Middle Text */}
        {(currentIndex === 3 || currentSlide.id === 4) && (
          <div className="w-full relative min-h-[460px] sm:min-h-[520px] my-2 overflow-visible select-none flex items-center justify-center">
            {/* Upper Left Video */}
            <div className="absolute top-[0%] left-[0%] sm:left-[4%] flex flex-col items-center vector-hover-3 z-20 animate-burst-top-left group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s4_1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-32 sm:w-44 md:w-52 aspect-video object-cover"
                />
              </div>
            </div>

            {/* Upper Right Video */}
            <div className="absolute top-[0%] right-[0%] sm:right-[4%] flex flex-col items-center vector-hover-2 z-20 animate-burst-top-right group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s4_2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-32 sm:w-44 md:w-52 aspect-video object-cover"
                />
              </div>
            </div>

            {/* Centered Middle Text */}
            <div className="relative z-10 max-w-lg px-4 text-center mt-28 sm:mt-32 animate-burst-center-title">
              <p className="text-lg sm:text-2xl font-medium text-white/95 leading-relaxed drop-shadow-md">
                {currentSlide.content}
              </p>
            </div>
          </div>
        )}

        {/* Slide 5: 6 Floating Videos Scattered Around Middle Text (Slide 8 Layout Pattern) */}
        {(currentIndex === 4 || currentSlide.id === 5) && (
          <div className="w-full relative min-h-[500px] sm:min-h-[580px] my-2 overflow-visible select-none flex items-center justify-center">
            {/* Centered Middle Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center animate-burst-center-title">
              <p className="text-xl sm:text-3xl font-bold text-white leading-relaxed drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] max-w-sm">
                {currentSlide.content}
              </p>
            </div>

            {/* 1. Top-Left Video */}
            <div className="absolute top-[-3%] left-[0%] sm:left-[2%] flex flex-col items-center vector-hover-3 z-20 animate-burst-top-left group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-26 sm:w-36 md:w-44 aspect-video object-cover"
                />
              </div>
            </div>

            {/* 2. Top-Right Video */}
            <div className="absolute top-[-5%] right-[0%] sm:right-[2%] flex flex-col items-center vector-hover-2 z-20 animate-burst-top-right group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-26 sm:w-36 md:w-44 aspect-video object-cover"
                />
              </div>
            </div>

            {/* 3. Middle-Left Video */}
            <div className="absolute top-[44%] left-[-2%] sm:left-[0%] flex flex-col items-start vector-hover-1 z-20 animate-burst-middle-left group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-24 sm:w-32 md:w-40 aspect-video object-cover"
                />
              </div>
            </div>

            {/* 4. Middle-Right Video */}
            <div className="absolute top-[44%] right-[-2%] sm:right-[0%] flex flex-col items-center vector-hover-1 z-20 animate-burst-middle-right group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_4.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-24 sm:w-32 md:w-40 aspect-video object-cover"
                />
              </div>
            </div>

            {/* 5. Bottom-Left Video */}
            <div className="absolute bottom-[-3%] left-[8%] sm:left-[14%] flex flex-col items-center vector-hover-2 z-20 animate-burst-bottom-left group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_5.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-26 sm:w-36 md:w-42 aspect-video object-cover"
                />
              </div>
            </div>

            {/* 6. Bottom-Right Video */}
            <div className="absolute bottom-[-5%] right-[8%] sm:right-[14%] flex flex-col items-center vector-hover-3 z-20 animate-burst-bottom-right group">
              <div className="rounded-2xl overflow-hidden border border-rose-500/30 bg-black/60 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:border-rose-400/60 group-hover:scale-105">
                <video
                  src="/assets/vids/vid_s5_6.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-26 sm:w-36 md:w-42 aspect-video object-cover"
                />
              </div>
            </div>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center animate-burst-center-title">
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] max-w-lg">
                {currentSlide.title || "The things that remind me of you"}
              </h1>
            </div>

            {/* 1. Blue Whales (Top-Left) */}
            <div
              className="absolute top-[-2%] left-[0%] sm:left-[4%] flex flex-col items-center vector-hover-3 z-20 animate-burst-top-left"
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
              className="absolute top-[-4%] right-[0%] sm:right-[4%] flex flex-col items-center vector-hover-2 z-20 animate-burst-top-right"
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

            {/* 3. 3.14 with (My birthday btw) (Middle-Left) */}
            <div
              className="absolute top-[46%] left-[-2%] sm:left-[1%] flex flex-col items-start vector-hover-1 z-20 animate-burst-middle-left"
            >
              <div className="flex items-center gap-1 group cursor-default">
                <span className="text-4xl sm:text-6xl font-black font-mono text-amber-200 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                  3.14
                </span>
              </div>
              <div className="mt-0.5 text-amber-100/90 pl-0.5">
                <span className="text-xs sm:text-base font-bold tracking-wide italic drop-shadow font-poppins">
                  (My birthday btw)
                </span>
              </div>
            </div>

            {/* 4. The Color Red (Middle-Right) */}
            <div
              className="absolute top-[48%] right-[-2%] sm:right-[1%] flex flex-col items-center vector-hover-1 z-20 animate-burst-middle-right"
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
              className="absolute bottom-[-2%] left-[12%] sm:left-[18%] flex flex-col items-center vector-hover-2 z-20 animate-burst-bottom-left"
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
              className="absolute bottom-[-4%] right-[12%] sm:right-[18%] flex flex-col items-center vector-hover-3 z-20 animate-burst-bottom-right"
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

        {(!currentSlide.revealText || isRevealed) && (
          <button
            onClick={handleNextWithCheck}
            className="btn-crimson flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-semibold shadow-2xl cursor-pointer hover:scale-105 border border-white/20 ml-auto"
          >
            <span>{currentIndex === slides.length - 1 ? 'Go to Question 💕' : 'Next Message'}</span>
            {currentIndex < slides.length - 1 ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <Heart className="w-4 h-4 fill-white" />
            )}
          </button>
        )}
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
