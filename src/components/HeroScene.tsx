import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Clean wireframe icosahedron hero element.
 * - Pure wireframe (no solid faces).
 * - Subtle parallax tilt toward the cursor with lerp smoothing.
 * - Pauses on tab hidden + zeros out velocity to prevent runaway spin
 *   from accumulated movement when returning to the tab.
 */

const MAX_DELTA = 0.05;

const WireGeo = ({
  pointer,
  visibleRef,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  visibleRef: React.MutableRefObject<boolean>;
}) => {
  const group = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!group.current) return;
    if (!visibleRef.current) {
      // Hard freeze while tab hidden.
      return;
    }

    // Compute target tilt from pointer (max ±10°).
    const maxTilt = (10 * Math.PI) / 180;
    targetRot.current.x = pointer.current.y * maxTilt;
    targetRot.current.y = pointer.current.x * maxTilt;

    // Lerp current toward target (factor 0.05) with per-frame clamp.
    const lerp = 0.05;
    let dx = (targetRot.current.x - currentRot.current.x) * lerp;
    let dy = (targetRot.current.y - currentRot.current.y) * lerp;
    dx = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, dx));
    dy = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, dy));
    currentRot.current.x += dx;
    currentRot.current.y += dy;

    // Apply tilt + slow auto-rotate on Y.
    group.current.rotation.x = currentRot.current.x;
    group.current.rotation.y += 0.003;
    group.current.rotation.y += dy; // additive parallax on Y
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshStandardMaterial
          color="#38BDF8"
          wireframe
          transparent
          opacity={0.6}
          emissive="#38BDF8"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

const HeroScene = () => {
  const pointer = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(true);

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        // Zero out pointer so we don't snap on return.
        pointer.current.x = 0;
        pointer.current.y = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      className="relative h-[45vh] w-full"
      onPointerMove={(e) => {
        if (!visibleRef.current) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-violet-glow)" }}
      />
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.3} />
        {/* Soft electric-blue glow from inside the geometry */}
        <pointLight position={[0, 0, 0]} intensity={2} color="#38BDF8" distance={6} />
        <pointLight position={[3, 2, 4]} intensity={0.6} color="#818CF8" />
        <WireGeo pointer={pointer} visibleRef={visibleRef} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
