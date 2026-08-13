import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import svgPaths from '../../generated/svg-cq2lewbljb';

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
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 12 + Math.random() * 12,
      size: 16 + Math.random() * 20,
      delay: Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#8A181A]">
      {/* Exact Likhani Editorial Banner SVG Background Pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1400 600"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          style={{ background: '#8A181A' }}
        >
          <style>{`
            @keyframes gentleFloat1 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(8px, -12px) rotate(3deg) scale(1.02); }
            }
            @keyframes gentleFloat2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(-6px, 10px) rotate(-4deg) scale(0.98); }
            }
            @keyframes gentleFloat3 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(10px, 8px) rotate(2deg) scale(1.03); }
            }
            @keyframes gentleFloat4 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(-8px, -10px) rotate(-3deg) scale(0.97); }
            }
            @keyframes gentleFloat5 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(7px, 12px) rotate(4deg) scale(1.01); }
            }
            @keyframes gentleFloat6 {
              0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
              50% { transform: translate(-10px, 6px) rotate(-2deg) scale(0.99); }
            }
          `}</style>
          <g
            opacity="0.22"
            transform="translate(0, 150)"
            fill="#CD5D5D"
            stroke="#CD5D5D"
          >
            <rect height="69.7586" strokeLinejoin="round" strokeWidth="6" transform="rotate(30 30.7812 8.90192)" width="69.7586" x="30.7812" y="8.90192" style={{ animation: 'gentleFloat1 22s ease-in-out infinite' }} />
            <circle cx="76.9999" cy="238" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 18s ease-in-out infinite' }} />
            <circle cx="1040" cy="72" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 20s ease-in-out infinite' }} />
            <path d={svgPaths.p4f09b00} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat4 24s ease-in-out infinite' }} />
            <rect height="123" strokeLinejoin="round" strokeWidth="5" transform="rotate(31.9574 279.658 134.556)" width="123" x="279.658" y="134.556" fill="none" style={{ animation: 'gentleFloat5 19s ease-in-out infinite' }} />
            <circle cx="448" cy="95" r="61.5" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat6 21s ease-in-out infinite' }} />
            <path d={svgPaths.p1dcfb980} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat1 25s ease-in-out infinite' }} />
            <path d={svgPaths.p1c6b1700} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 23s ease-in-out infinite' }} />
            <path d={svgPaths.p3d6a600} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 26s ease-in-out infinite' }} />
            <path d={svgPaths.p347edc80} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat4 20s ease-in-out infinite' }} />
            <path d={svgPaths.peeaf800} strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat5 22s ease-in-out infinite' }} />
            <path d={svgPaths.pd790400} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat6 24s ease-in-out infinite' }} />
            <path d={svgPaths.pb073900} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat1 27s ease-in-out infinite' }} />
          </g>
        </svg>
      </div>

      {/* Subtle Warm Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8A181A]/40 via-transparent to-[#5c0e10]/60" />

      {/* Sentimental Warm Radial Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] bg-white/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-black/20 rounded-full blur-[150px]" />

      {/* Floating Animated Hearts */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="heart-particle text-white/30 select-none absolute drop-shadow-md"
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 text-xs font-semibold shadow-xl transition-all cursor-pointer"
          title={isPlayingAudio ? 'Mute ambient music' : 'Play ambient music'}
          aria-label="Toggle audio"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 text-white animate-pulse" />
              <span className="font-poppins">Music On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/70" />
              <span className="font-poppins">Music Off</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
