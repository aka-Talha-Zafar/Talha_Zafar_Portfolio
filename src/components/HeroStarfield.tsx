import { useEffect, useRef } from "react";

/**
 * Two-layer hero starfield:
 *  - Layer 1: sparse white dots across the full viewport (80)
 *  - Layer 2: dense cluster behind the globe (right ~45% width, vertically centered)
 * Both layers drift very slowly. Layer 1 wraps at viewport edges, Layer 2
 * respawns inside its region when a dot drifts out.
 */
const HeroStarfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    type Star = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let global: Star[] = [];
    let cluster: Star[] = [];

    // Cluster region (right 45% width, vertically centered ~70% height)
    let region = { x: 0, y: 0, w: 0, h: 0 };

    const computeRegion = () => {
      const regionW = w * 0.45;
      const regionH = h * 0.7;
      region = {
        x: w - regionW - w * 0.02, // small inset from right edge
        y: (h - regionH) / 2,
        w: regionW,
        h: regionH,
      };
    };

    const makeDrift = (min: number, max: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = min + Math.random() * (max - min);
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      computeRegion();

      // Layer 1: 80 sparse global dots
      global = Array.from({ length: 80 }, () => {
        const d = makeDrift(0.015, 0.05);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: d.vx,
          vy: d.vy,
          r: 0.4 + Math.random() * 0.6,
          a: 0.2 + Math.random() * 0.25,
        };
      });

      // Layer 2: ~200 dense cluster dots inside region
      cluster = Array.from({ length: 200 }, () => {
        const d = makeDrift(0.01, 0.04);
        return {
          x: region.x + Math.random() * region.w,
          y: region.y + Math.random() * region.h,
          vx: d.vx,
          vy: d.vy,
          r: 0.3 + Math.random() * 0.6,
          a: 0.15 + Math.random() * 0.35,
        };
      });
    };

    const respawnInRegion = (s: Star) => {
      s.x = region.x + Math.random() * region.w;
      s.y = region.y + Math.random() * region.h;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Layer 1 — global sparse
      for (const s of global) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();

        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -2) s.x = w + 2;
          else if (s.x > w + 2) s.x = -2;
          if (s.y < -2) s.y = h + 2;
          else if (s.y > h + 2) s.y = -2;
        }
      }

      // Layer 2 — dense cluster behind globe
      for (const s of cluster) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();

        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (
            s.x < region.x ||
            s.x > region.x + region.w ||
            s.y < region.y ||
            s.y > region.y + region.h
          ) {
            respawnInRegion(s);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default HeroStarfield;
