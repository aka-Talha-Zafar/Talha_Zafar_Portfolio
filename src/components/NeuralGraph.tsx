import { useEffect, useRef } from "react";

/**
 * Minimal animated neural network node graph on canvas.
 * Nodes drift via simple noise; connections fade with proximity.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  pulse: number;
  pulseSpeed: number;
};

const NODE_COUNT = 11;
const CONNECT_DIST = 0.32; // normalized to min(w,h)

const NeuralGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Seeded layout — distribute roughly across the canvas
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i / NODE_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 0.18 + Math.random() * 0.28;
      return {
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.00025,
        vy: (Math.random() - 0.5) * 0.00025,
        baseR: 2 + Math.random() * 2.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
      };
    });

    let raf = 0;
    let visible = true;
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    const draw = () => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // Update positions
      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0.08 || n.x > 0.92) n.vx *= -1;
          if (n.y < 0.08 || n.y > 0.92) n.vy *= -1;
          n.pulse += n.pulseSpeed;
        }
      }

      // Draw connections
      const minD = Math.min(w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.strokeStyle = `hsl(199 89% 60% / ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const px = n.x * w;
        const py = n.y * h;
        const pulse = (Math.sin(n.pulse) + 1) / 2; // 0..1
        const r = n.baseR + pulse * 1.2;

        // Glow halo
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        grad.addColorStop(0, `hsl(199 89% 60% / ${0.45 + pulse * 0.25})`);
        grad.addColorStop(1, "hsl(199 89% 60% / 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsl(199 89% 70% / ${0.85 + pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ contain: "layout paint size" }}
    />
  );
};

export default NeuralGraph;
