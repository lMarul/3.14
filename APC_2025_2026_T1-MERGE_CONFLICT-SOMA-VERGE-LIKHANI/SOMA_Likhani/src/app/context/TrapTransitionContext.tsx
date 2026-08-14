import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

interface TrapTransitionContextType {
  triggerTrap: (target?: string) => void;
  isTrapping: boolean;
}

const TrapTransitionContext = createContext<TrapTransitionContextType>({
  triggerTrap: () => {},
  isTrapping: false,
});

export const useTrapTransition = () => useContext(TrapTransitionContext);

// Dynamic TrapElement helper for granular micro-element chaotic breakdown
export const TrapElement: React.FC<{
  children: React.ReactNode;
  delay?: number;
  rotate?: number;
  xDrift?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  delay = 0,
  rotate = 8,
  xDrift = 0,
  duration = 3.6,
  className = '',
  style = {},
}) => {
  const { isTrapping } = useTrapTransition();

  // Compute horizontal drift if not explicitly specified
  const calcXDrift = xDrift !== 0 ? xDrift : (rotate > 0 ? 55 : -55);

  return (
    <motion.div
      animate={isTrapping ? {
        x: [0, calcXDrift * 0.25, calcXDrift],
        y: [0, 90, 1600],
        rotateZ: [0, rotate > 0 ? 4 : -4, rotate],
        scale: [1, 0.98, 0.85],
        opacity: [1, 1, 0],
      } : { x: 0, y: 0, rotateZ: 0, scale: 1, opacity: 1 }}
      transition={{
        duration: duration,
        delay: isTrapping ? delay : 0,
        ease: [0.45, 0.05, 0.55, 0.95], // Physical gravity acceleration curve
      }}
      style={{ transformOrigin: 'center center', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Subtle falling sound effect with gentle frequency ramp
function playFallAudio() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 2.8);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.8);
  } catch (e) {}
}

export const TrapTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isTrapping, setIsTrapping] = useState(false);

  // Prevent unwanted scrollbars during tumbling sequence
  useEffect(() => {
    if (isTrapping) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTrapping]);

  const triggerTrap = useCallback((target: string = '/conf') => {
    if (isTrapping) return;
    
    setIsTrapping(true);
    playFallAudio();

    // Tumbling sequence completes around 4.0s: navigate to /conf where 5-second fade-in starts smoothly
    setTimeout(() => {
      navigate(target);
    }, 4000);

    setTimeout(() => {
      setIsTrapping(false);
    }, 9500);
  }, [isTrapping, navigate]);

  return (
    <TrapTransitionContext.Provider value={{ triggerTrap, isTrapping }}>
      <div className="relative w-full min-h-screen overflow-hidden bg-[#8A181A]">
        <div className="w-full min-h-screen relative z-10">
          {children}
        </div>
      </div>
    </TrapTransitionContext.Provider>
  );
};
