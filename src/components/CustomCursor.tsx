import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: subtle dot + ring.
 * Gentle hover emphasis for interactive elements.
 * Disabled on touch / coarse pointer devices and reduced-motion.
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("a, button, [role='button'], input, textarea, [data-cursor='hover']");
        hoveringRef.current = !!interactive;
      }
    };

    const tick = () => {
      // Slight lag for the ring, dot stays snappy.
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        const hovering = hoveringRef.current;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${hovering ? 1.25 : 1})`;
        ringRef.current.style.opacity = hovering ? "0.95" : "0.55";
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full border border-foreground/20 transition-[opacity,transform] duration-150 ease-out"
        style={{
          // Keep it professional: no blend-mode glow.
          mixBlendMode: "normal",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-foreground"
        style={{ boxShadow: "0 0 0 1px hsl(var(--background) / 0.8)" }}
      />
    </>
  );
};

export default CustomCursor;
