'use client';
import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Shape types ─── */
type ShapeKind = 'cube' | 'octahedron' | 'ring' | 'sphere';

interface ShapeConfig {
  kind: ShapeKind;
  position: [number, number, number];
  basePosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
  floatSeed: number;
  color: string;
}

const SHAPE_COUNT_DESKTOP = 28;
const SHAPE_COUNT_MOBILE = 16;

function getShapeCount() {
  if (typeof window === 'undefined') return SHAPE_COUNT_DESKTOP;
  return window.innerWidth < 768 ? SHAPE_COUNT_MOBILE : SHAPE_COUNT_DESKTOP;
}

const KINDS: ShapeKind[] = ['cube', 'octahedron', 'ring', 'sphere'];

/* Palette-aware colors: navy, amber accent, and muted gray */
const SHAPE_COLORS = [
  '#c9a84c', // gilded gold — dominant
  '#c9a84c',
  '#bfb5a0', // warm gray
  '#e8d5a0', // light gold accent — sparse
  '#776f61', // muted warm
  '#c9a84c',
];

function createGeometry(kind: ShapeKind): THREE.BufferGeometry {
  switch (kind) {
    case 'cube':
      return new THREE.BoxGeometry(1, 1, 1);
    case 'octahedron':
      return new THREE.OctahedronGeometry(0.7, 0);
    case 'ring':
      return new THREE.TorusGeometry(0.55, 0.12, 8, 24);
    case 'sphere':
      return new THREE.IcosahedronGeometry(0.5, 1);
  }
}

/* ─── Single animated shape ─── */
function FloatingShape({
  config,
  mouseRef,
}: {
  config: ShapeConfig;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => createGeometry(config.kind), [config.kind]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const { floatSeed, rotationSpeed, basePosition } = config;

    // Gentle ambient float
    const floatX = Math.sin(t * 0.4 + floatSeed) * 0.3;
    const floatY = Math.cos(t * 0.3 + floatSeed * 1.3) * 0.25;
    const floatZ = Math.sin(t * 0.2 + floatSeed * 0.7) * 0.15;

    // Subtle mouse influence: shapes gently drift away from cursor
    const mouse = mouseRef.current;
    let pushX = 0;
    let pushY = 0;
    if (mouse) {
      const mx = mouse.x * 5;
      const my = mouse.y * 4;
      const dx = basePosition[0] - mx;
      const dy = basePosition[1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 6;
      if (dist < maxDist) {
        const strength = (1 - dist / maxDist) * 0.4;
        pushX = dx * strength;
        pushY = dy * strength;
      }
    }

    meshRef.current.position.set(
      basePosition[0] + floatX + pushX,
      basePosition[1] + floatY + pushY,
      basePosition[2] + floatZ,
    );

    // Slow continuous rotation
    meshRef.current.rotation.x += rotationSpeed[0] * 0.003;
    meshRef.current.rotation.y += rotationSpeed[1] * 0.003;
    meshRef.current.rotation.z += rotationSpeed[2] * 0.002;

    // Subtle scale pulse near mouse
    if (mouse) {
      const mx = mouse.x * 5;
      const my = mouse.y * 4;
      const dx2 = meshRef.current.position.x - mx;
      const dy2 = meshRef.current.position.y - my;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      const proximity = Math.max(0, 1 - dist2 / 5);
      const pulse = 1 + proximity * 0.12 * Math.sin(t * 2 + floatSeed);
      meshRef.current.scale.setScalar(config.scale * pulse);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={config.basePosition}
      rotation={config.rotation}
      scale={config.scale}
    >
      <meshStandardMaterial
        color={config.color}
        transparent
        opacity={config.color === '#e8d5a0' ? 0.5 : 0.15}
        wireframe={config.kind === 'cube' || config.kind === 'octahedron'}
        roughness={0.8}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Field of floating geometric shapes ─── */
export function GeometricField() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const count = useMemo(getShapeCount, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const shapes = useMemo<ShapeConfig[]>(() => {
    const configs: ShapeConfig[] = [];
    for (let i = 0; i < count; i++) {
      const kind = KINDS[i % KINDS.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 6;
      const z = -1 + (Math.random() - 0.5) * 4;

      configs.push({
        kind,
        position: [x, y, z],
        basePosition: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.3 + Math.random() * 0.7,
        rotationSpeed: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ],
        floatSeed: Math.random() * 100,
        color: SHAPE_COLORS[i % SHAPE_COLORS.length],
      });
    }
    return configs;
  }, [count]);

  return (
    <group>
      {shapes.map((config, i) => (
        <FloatingShape key={i} config={config} mouseRef={mouseRef} />
      ))}
    </group>
  );
}
