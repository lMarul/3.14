import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundEffectsProps {
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  isPlayingAudio,
  onToggleAudio,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; duration: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 16 + Math.random() * 14,
      size: 14 + Math.random() * 20,
      delay: Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F7F6F3]">
      {/* Background Floating Animated Vector Group (matching design specs) */}
      <div className="absolute inset-0 opacity-25">
        {/* Vector 1 - Top Left Floating Square */}
        <div
          className="vector-hover-1 absolute w-32 h-32 rounded-3xl bg-[#CD5D5D]/20 border-[8px] border-[#CD5D5D]"
          style={{ left: '2%', top: '5%' }}
        />

        {/* Vector 2 - Bottom Left Rotated Card */}
        <div
          className="vector-hover-2 absolute w-48 h-36 rounded-2xl bg-[#CD5D5D]/20 border-[8px] border-[#CD5D5D]"
          style={{ left: '1%', top: '65%' }}
        />

        {/* Vector 3 - Top Right Vector Box */}
        <div
          className="vector-hover-3 absolute w-40 h-40 rounded-3xl bg-[#CD5D5D]/20 border-[8px] border-[#CD5D5D]"
          style={{ right: '8%', top: '6%' }}
        />

        {/* Vector 4 - Center Top Accent Frame */}
        <div
          className="vector-hover-1 absolute w-36 h-28 rounded-2xl bg-[#CD5D5D]/20 border-[8px] border-[#CD5D5D]"
          style={{ left: '44%', top: '3%' }}
        />

        {/* Vector 5 - Mid Left Rotated Border Ring */}
        <div
          className="vector-hover-2 absolute w-28 h-28 rounded-full border-[7px] border-[#CD5D5D]"
          style={{ left: '15%', top: '43%' }}
        />

        {/* Vector 6 - Mid Right Double Border Frame */}
        <div
          className="vector-hover-3 absolute w-52 h-36 rounded-3xl border-[12px] border-[#CD5D5D]"
          style={{ right: '12%', top: '55%' }}
        />

        {/* Vector 7 - Bottom Center Soft Filled Vector */}
        <div
          className="vector-hover-1 absolute w-44 h-28 rounded-2xl bg-[#CD5D5D]/20 border-[8px] border-[#CD5D5D]"
          style={{ left: '55%', top: '68%' }}
        />

        {/* Vector 8 - Top Mid-Right Hollow Frame */}
        <div
          className="vector-hover-2 absolute w-36 h-36 rounded-2xl border-[7px] border-[#CD5D5D]"
          style={{ left: '55%', top: '5%' }}
        />
      </div>

      {/* Sentimental Warm Radial Glow Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8A181A]/5 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-[#8A181A]/5 rounded-full blur-[140px]" />

      {/* Floating Animated Hearts */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="heart-particle text-[#8A181A]/20 select-none"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}px`,
          }}
        >
          ♥
        </div>
      ))}

      {/* Audio Music Toggle Control */}
      <div className="pointer-events-auto fixed bottom-5 right-5 z-50">
        <button
          onClick={onToggleAudio}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E5E7EB] text-[#4A5565] hover:text-[#8A181A] hover:border-[#8A181A]/40 text-xs font-semibold shadow-md transition-all"
          title={isPlayingAudio ? 'Mute ambient music' : 'Play ambient music'}
          aria-label="Toggle audio"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 text-[#8A181A] animate-pulse" />
              <span className="font-poppins">Music On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#6A7282]" />
              <span className="font-poppins">Music Off</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
