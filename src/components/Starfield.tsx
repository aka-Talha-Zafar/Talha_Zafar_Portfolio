import { useEffect, useRef } from "react";

/**
 * Lightweight starfield. Slow drifting points with subtle parallax.
 * Respects reduced-motion (renders a single static frame).
 */
const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    type Star = { x: number; y: number; z: number; r: number; tw: number };
    let stars: Star[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = 0.55 + Math.sin(t * 0.0008 + s.tw) * 0.45;
        const alpha = 0.15 + s.z * 0.55 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        // Mostly white with a faint cool tint on the brightest stars
        ctx.fillStyle =
          s.z > 0.75
            ? `hsla(199, 89%, 80%, ${alpha})`
            : `hsla(220, 30%, 95%, ${alpha * 0.8})`;
        ctx.fill();

        if (!reduced) {
          s.y += 0.03 * s.z;
          if (s.y > h) {
            s.y = -2;
            s.x = Math.random() * w;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
};

export default Starfield;
