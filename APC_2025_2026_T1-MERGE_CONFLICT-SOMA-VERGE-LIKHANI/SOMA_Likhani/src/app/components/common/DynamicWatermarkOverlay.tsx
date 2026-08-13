import React, { useRef, useEffect, useCallback } from 'react';

interface DynamicWatermarkOverlayProps {
  /** Opacity of the watermark (0–1). Default 0.06 */
  opacity?: number;
  /** Font size in px. Default 13 */
  fontSize?: number;
  /** Enable subtle position drift animation. Default true */
  animate?: boolean;
  /** Additional CSS class on the container */
  className?: string;
  /** Whether the controls are currently visible, to dodge them */
  controlsVisible?: boolean;
}

/**
 * Canvas-based dynamic watermark overlay.
 *
 * - Renders user-specific text onto a <canvas> as pixel data (not DOM text)
 * - Tiles diagonally across the full container area
 * - Uses CSS transform for subtle drift animation (GPU-accelerated)
 * - Self-heals via MutationObserver if removed or hidden through DevTools
 * - pointer-events: none — does NOT block user interaction
 */
const DynamicWatermarkOverlay: React.FC<DynamicWatermarkOverlayProps> = ({
  opacity = 0.06,
  fontSize = 13,
  animate = true,
  className = '',
  controlsVisible = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);

  /**
   * Draws the tiled watermark onto the canvas.
   * Called on mount, resize, and when watermark data changes.
   */
  const drawWatermark = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // For the logo, we don't need a full screen canvas, just enough for the logo.
    // However, to keep it drop-in compatible, we can keep the full screen canvas
    // and just position the drawing, OR we can resize the canvas. 
    // To ensure crisp rendering, we'll keep the canvas full container size as before
    // but we will move the entire DOM element via CSS transforms when controls appear.
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Limit DPR to 2 for mobile memory efficiency
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(rect.width, 2048);
    const h = Math.min(rect.height, 2048);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Draw the image logo
    if (logoRef.current) {
      const img = logoRef.current;
      const logoWidth = 140; // Desired width in pixels
      const logoHeight = (img.height / img.width) * logoWidth;

      // Bottom right positioning
      const paddingX = 24;
      const paddingY = 24;
      const startX = w - paddingX - logoWidth;
      const startY = h - paddingY - logoHeight;

      ctx.globalAlpha = opacity;
      ctx.drawImage(img, startX, startY, logoWidth, logoHeight);
      ctx.globalAlpha = 1.0;
    }

  }, [opacity]);

  // Load the logo image
  useEffect(() => {
    const img = new Image();
    img.src = '/SOMALogoLightMode.png';
    img.onload = () => {
      logoRef.current = img;
      drawWatermark();
    };
  }, [drawWatermark]);

  /**
   * Subtle drift animation using CSS transforms (GPU-accelerated).
   * Moves ±3px over ~8 seconds. Near-zero CPU cost.
   */
  useEffect(() => {
    if (!animate) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Slow sinusoidal drift
      const dx = Math.sin(elapsed * 0.4) * 3;
      const dy = Math.cos(elapsed * 0.3) * 2;
      canvas.style.transform = `translate(${dx}px, ${dy}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  /**
   * Observe container size changes and redraw.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    drawWatermark();

    // ResizeObserver for responsive redraws
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => drawWatermark());
      ro.observe(container);
    } else {
      // Fallback for very old browsers
      window.addEventListener('resize', drawWatermark);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', drawWatermark);
    };
  }, [drawWatermark]);

  /**
   * MutationObserver self-healing: re-inject canvas if it's removed or hidden.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ensureCanvas = () => {
      if (!canvasRef.current || !container.contains(canvasRef.current)) {
        // Canvas was removed — recreate
        const newCanvas = document.createElement('canvas');
        applyCanvasStyles(newCanvas);
        container.appendChild(newCanvas);
        canvasRef.current = newCanvas;
        drawWatermark();
      } else {
        // Check if someone hid it via DevTools
        const style = canvasRef.current.style;
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          applyCanvasStyles(canvasRef.current);
          drawWatermark();
        }
      }
    };

    const observer = new MutationObserver(() => {
      ensureCanvas();
    });

    observer.observe(container, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, [drawWatermark]);

  /**
   * Initial canvas creation (ref callback style)
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Don't duplicate
    if (canvasRef.current && container.contains(canvasRef.current)) return;

    const canvas = document.createElement('canvas');
    applyCanvasStyles(canvas);
    container.appendChild(canvas);
    canvasRef.current = canvas;
    drawWatermark();

    return () => {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
    };
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when watermark data changes
  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      style={{ 
        zIndex: 5, 
        overflow: 'hidden',
        transform: controlsVisible ? 'translateY(-70px)' : 'translateY(0px)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
        opacity: 1
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Apply mandatory inline styles to the watermark canvas.
 * Using inline styles makes them harder to override via external CSS.
 */
function applyCanvasStyles(canvas: HTMLCanvasElement) {
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    z-index: 5;
    display: block;
    visibility: visible;
    opacity: 1;
  `.trim();
}

DynamicWatermarkOverlay.displayName = 'DynamicWatermarkOverlay';

export default React.memo(DynamicWatermarkOverlay);
