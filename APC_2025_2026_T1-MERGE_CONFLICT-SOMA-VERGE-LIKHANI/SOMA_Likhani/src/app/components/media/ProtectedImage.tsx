import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWatermarkData } from '../../hooks/useWatermarkData';

interface ProtectedImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS class on the outer wrapper */
  className?: string;
  /** Aspect ratio CSS value. Default: auto */
  aspectRatio?: string;
  /** Watermark opacity (0–1). Default 0.07 */
  watermarkOpacity?: number;
  /** Watermark font size in px. Default 12 */
  watermarkFontSize?: number;
  /** Callback on image load error */
  onError?: () => void;
}

/**
 * Canvas-based protected image component.
 *
 * - Draws the source image onto a <canvas> element
 * - Burns user-specific watermark text directly into the canvas pixel data
 * - Prevents right-click save, drag, and copy
 * - Supports Retina/HiDPI via devicePixelRatio scaling (capped at 2)
 * - Falls back to a standard <img> if canvas rendering fails
 */
export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  watermarkOpacity = 0.07,
  watermarkFontSize = 12,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const watermarkData = useWatermarkData();

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setIsLoading(false);

      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Size canvas to container, not to image native size
      const cw = rect.width;
      const ch = rect.height || (cw * img.naturalHeight) / img.naturalWidth;

      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setUseFallback(true);
        return;
      }

      ctx.scale(dpr, dpr);

      // Draw the image scaled to fill the canvas (object-cover equivalent)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgAspect > canvasAspect) {
        // Image wider — crop sides
        sw = img.naturalHeight * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        // Image taller — crop top/bottom
        sh = img.naturalWidth / canvasAspect;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

      // Burn watermark into the canvas
      const lines = watermarkData.displayText.split('\n');
      const fontSize = watermarkFontSize;
      const lineHeight = fontSize * 1.4;

      ctx.font = `600 ${fontSize}px 'Poppins', 'Inter', system-ui, sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
      ctx.textBaseline = 'top';

      const blockHeight = lines.length * lineHeight;
      const tileW = Math.max(220, cw * 0.25);
      const tileH = Math.max(blockHeight + 40, ch * 0.2);

      ctx.save();
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate((-25 * Math.PI) / 180);
      ctx.translate(-cw / 2, -ch / 2);

      const overflow = Math.max(cw, ch);
      for (let y = -overflow; y < ch + overflow; y += tileH) {
        for (let x = -overflow; x < cw + overflow; x += tileW) {
          lines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * lineHeight);
          });
        }
      }

      ctx.restore();
    };

    img.onerror = () => {
      setIsLoading(false);
      setUseFallback(true);
      onError?.();
    };

    img.src = src;
  }, [src, watermarkData.displayText, watermarkOpacity, watermarkFontSize, onError]);

  // Draw on mount and when dependencies change
  useEffect(() => {
    if (useFallback) return;
    drawImage();
  }, [drawImage, useFallback]);

  // Redraw on resize
  useEffect(() => {
    if (useFallback) return;
    const container = containerRef.current;
    if (!container) return;

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => drawImage());
      ro.observe(container);
    }

    return () => { if (ro) ro.disconnect(); };
  }, [drawImage, useFallback]);

  if (useFallback) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ aspectRatio, userSelect: 'none', WebkitUserSelect: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onError={onError}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block w-full h-full select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
        }}
        aria-label={alt}
        role="img"
      />
    </div>
  );
};

ProtectedImage.displayName = 'ProtectedImage';
