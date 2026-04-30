import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { TECH_SPHERE, type TechMarker } from "@/data/techSphere";

/**
 * Cobe globe with dots only — labels appear as DOM tooltips on hover so
 * they never overlap on the sphere.
 * Bug fix retained: pause + reset state on tab visibility change so
 * accumulated pointer deltas from background tabs cannot cause runaway spin.
 */

const TECHS = TECH_SPHERE satisfies TechMarker[];

const MAX_VELOCITY = 0.08; // hard clamp per frame on phi delta

function latLngToVec3(lat: number, lng: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const lastPhiRef = useRef(0);
  const visibleRef = useRef(true);
  const [phiState, setPhiState] = useState(0);
  const [size, setSize] = useState(440);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<TechMarker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
      setSize(width);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        pointerInteractionMovement.current = 0;
        pointerInteracting.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let globe: ReturnType<typeof createGlobe> | undefined;
    try {
      const opts = {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 4,
        baseColor: [0.05, 0.07, 0.12] as [number, number, number],
        markerColor: [0.22, 0.74, 0.97] as [number, number, number],
        glowColor: [0.51, 0.55, 0.97] as [number, number, number],
        markers: TECHS.map((t) => ({ location: t.location, size: 0.05 })),
        onRender: (state: Record<string, number>) => {
          if (!visibleRef.current) {
            state.phi = phiRef.current;
            state.width = width * 2;
            state.height = width * 2;
            return;
          }

          let nextPhi = phiRef.current;
          if (!pointerInteracting.current && !reduced) {
            nextPhi += 0.0035;
          }

          const targetPhi = nextPhi + pointerInteractionMovement.current / 200;
          const delta = targetPhi - lastPhiRef.current;
          const clamped = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, delta));
          const finalPhi = lastPhiRef.current + clamped;

          phiRef.current = nextPhi;
          lastPhiRef.current = finalPhi;
          state.phi = finalPhi;
          state.width = width * 2;
          state.height = width * 2;

          setPhiState(finalPhi);
        },
      };
      globe = createGlobe(canvas, opts as unknown as Parameters<typeof createGlobe>[1]);
    } catch {
      return;
    }

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      globe?.destroy();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const theta = 0.25;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  return (
    <div ref={containerRef} className="relative aspect-square w-full max-w-[460px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-glow)" }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Pinned info */}
      {pinned && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 rounded-xl border border-white/10 bg-background/70 p-3 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Tech Sphere
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{pinned.name}</p>
              <p className="mt-0.5 text-xs text-primary">{pinned.category}</p>
              {pinned.detail && (
                <p className="mt-1 text-xs text-muted-foreground">{pinned.detail}</p>
              )}
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground/70">click a node to pin</span>
          </div>
        </div>
      )}

      {/* Hover hit-targets — invisible dots projected from 3D, label only on hover */}
      <div className="absolute inset-0">
        {TECHS.map((t) => {
          const [x0, y0, z0] = latLngToVec3(t.location[0], t.location[1]);
          const cosP = Math.cos(-phiState);
          const sinP = Math.sin(-phiState);
          const xr = x0 * cosP + z0 * sinP;
          const zr = -x0 * sinP + z0 * cosP;
          const yr = y0 * cosT - zr * sinT;
          const zf = y0 * sinT + zr * cosT;

          const visible = zf > 0.05;
          const r = size * 0.42;
          const cx = size / 2;
          const cy = size / 2;
          const px = cx + xr * r;
          const py = cy - yr * r;

          if (!visible) return null;
          const isHover = hovered === t.name;

          return (
            <div
              key={t.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: px, top: py }}
            >
              <button
                type="button"
                aria-label={`${t.name} (${t.category})`}
                onMouseEnter={() => setHovered(t.name)}
                onMouseLeave={() => setHovered((h) => (h === t.name ? null : h))}
                onFocus={() => setHovered(t.name)}
                onBlur={() => setHovered((h) => (h === t.name ? null : h))}
                onClick={() => setPinned((p) => (p?.name === t.name ? null : t))}
                className="block h-3 w-3 rounded-full bg-transparent"
              />
              {isHover && (
                <span
                  className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-md border border-primary/40 bg-background/90 px-2 py-0.5 font-mono text-[10px] tracking-wide text-primary backdrop-blur-sm"
                  style={{ textShadow: "0 0 8px hsl(var(--primary) / 0.6)" }}
                >
                  {t.name}{" "}
                  <span className="text-muted-foreground/80">· {t.category}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Globe;
