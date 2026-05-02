import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { TECH_SPHERE, type TechMarker } from "@/data/techSphere";
import { loadSVGAsTexture } from "@/lib/svgToTexture";

function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

const categoryColor: Record<TechMarker["category"], string> = {
  "Core ML/DL": "#38BDF8",
  "Computer Vision": "#818CF8",
  "Backend / Deployment": "#34D399",
  "Frontend / 3D": "#38BDF8",
  Tools: "#818CF8",
};

// Icon marker component using texture loading
const IconMarker = ({
  marker,
  pos,
  isPinned,
  onHover,
  onPin,
}: {
  marker: TechMarker;
  pos: THREE.Vector3;
  isPinned: boolean;
  onHover: (m: TechMarker | null) => void;
  onPin: (m: TechMarker | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadSVGAsTexture(marker.iconUrl, marker.name, categoryColor[marker.category]).then(
      (loadedTexture) => {
        if (isMounted) {
          setTexture(loadedTexture);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [marker.iconUrl, marker.name, marker.category]);

  const color = new THREE.Color(categoryColor[marker.category]);
  const s = isPinned ? 0.26 : 0.21;

  return (
    <group position={pos}>
      {/* Invisible hit target */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(marker);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPin(isPinned ? null : marker);
        }}
      >
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Billboarded icon sprite */}
      <Billboard follow>
        {/* Subtle circular backdrop */}
        <mesh renderOrder={10}>
          <circleGeometry args={[s * 0.62, 24]} />
          <meshBasicMaterial
            color="#050810"
            transparent
            opacity={0.72}
            depthTest={false}
          />
        </mesh>
        
        {/* Colored ring - highlight when pinned */}
        <mesh renderOrder={11}>
          <ringGeometry args={[s * 0.62, s * 0.72, 28]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isPinned ? 0.32 : 0.18}
            depthTest={false}
          />
        </mesh>

        {/* Icon texture on plane */}
        {texture && (
          <mesh ref={meshRef} renderOrder={12} scale={s * 0.85}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={0.95}
              depthTest={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </Billboard>
    </group>
  );
};

const StackSphereScene = ({
  onHover,
  onPin,
  pinnedName,
}: {
  onHover: (m: TechMarker | null) => void;
  onPin: (m: TechMarker | null) => void;
  pinnedName: string | null;
}) => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += 0.002;
  });

  const radius = 2.0;
  const iconRadius = radius * 0.65; // Position icons inside the sphere volume

  const markers = useMemo(
    () =>
      TECH_SPHERE.map((m) => ({
        m,
        pos: latLngToVec3(m.location[0], m.location[1], iconRadius),
      })),
    [],
  );

  return (
    <group ref={group}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[radius, 28, 28]} />
        <meshStandardMaterial
          color="#38BDF8"
          wireframe
          transparent
          opacity={0.22}
          emissive="#38BDF8"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Markers with textured icons */}
      {markers.map(({ m, pos }) => {
        const isPinned = pinnedName === m.name;
        return (
          <IconMarker
            key={m.name}
            marker={m}
            pos={pos}
            isPinned={isPinned}
            onHover={onHover}
            onPin={onPin}
          />
        );
      })}
    </group>
  );
};

const StackSphere = () => {
  const [hover, setHover] = useState<TechMarker | null>(null);
  const [pinned, setPinned] = useState<TechMarker | null>(TECH_SPHERE[0] ?? null);

  const visible = hover ?? pinned;

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: "var(--gradient-violet-glow)" }}
      />

      <div className="relative aspect-square w-full">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.8]}>
          <ambientLight intensity={0.35} />
          <pointLight position={[0, 0, 0]} intensity={2.2} color="#38BDF8" distance={8} />
          <pointLight position={[3, 2, 4]} intensity={0.6} color="#818CF8" />
          <StackSphereScene
            onHover={setHover}
            onPin={setPinned}
            pinnedName={pinned?.name ?? null}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            rotateSpeed={0.7}
            dampingFactor={0.08}
            enableDamping
          />
        </Canvas>
      </div>

      {/* Info panel */}
      <div className="mt-3 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
          Tech Stack
        </p>
        {visible ? (
          <div className="mt-1">
            <p className="text-sm font-semibold text-foreground">{visible.name}</p>
            <p className="text-xs text-primary">{visible.category}</p>
            {visible.detail && <p className="mt-1 text-xs text-muted-foreground">{visible.detail}</p>}
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Drag to rotate · Hover to inspect · Click to pin</p>
        )}
      </div>
    </div>
  );
};

export default StackSphere;
