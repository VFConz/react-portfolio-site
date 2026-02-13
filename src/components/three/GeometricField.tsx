'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════════════════════════════════ */
type ShapeKind = 'cube' | 'octahedron' | 'ring' | 'sphere';

interface ShapeConfig {
  kind: ShapeKind;
  basePosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
  floatSeed: number;
  color: string;
  wireframe: boolean;
  baseOpacity: number;
  isDust?: boolean;
}

/* Increased density for immersive feel */
const SHAPE_COUNT_DESKTOP = 45;
const SHAPE_COUNT_MOBILE = 25;
const DUST_COUNT_DESKTOP = 20;
const DUST_COUNT_MOBILE = 10;

/* Increased line budget for denser connections */
const MAX_LINES_DESKTOP = 160;
const MAX_LINES_MOBILE = 50;

/** Radius (in world-space XY) for cursor proximity visual effects */
const INTERACTION_RADIUS_DESKTOP = 6.0;
const INTERACTION_RADIUS_MOBILE = 8.0;
/** Max distance between two shapes for a connection line (increased for denser web) */
const LINE_CONNECT_DIST = 5.0;
/** Shapes must be within this distance of the cursor to participate in lines */
const CURSOR_LINE_RADIUS = 7.0;

/* Inter-shape attraction constants */
const ATTRACTION_STRENGTH = 0.001;
const ATTRACTION_DECAY = 0.95;
const MAX_NEIGHBORS = 3;

const KINDS: ShapeKind[] = ['cube', 'octahedron', 'ring', 'sphere'];

/* Light-theme palette — warm earth / gold tones that pop against #faf8f4 */
const SHAPE_COLORS = [
  '#b8942e', // dark gold — accent
  '#b8942e',
  '#5a4f3a', // warm dark brown
  '#8a8070', // muted stone
  '#a07e1e', // rich gold
  '#b8942e',
];

const LINE_COLOR = new THREE.Color('#b8942e');

/* ═══════════════════════════════════════════════════════════════════
   Shared geometries (created once, reused by all shapes)
   ═══════════════════════════════════════════════════════════════════ */
function createGeometries(): Record<ShapeKind, THREE.BufferGeometry> {
  return {
    cube: new THREE.BoxGeometry(1, 1, 1),
    octahedron: new THREE.OctahedronGeometry(0.7, 0),
    ring: new THREE.TorusGeometry(0.55, 0.12, 8, 24),
    sphere: new THREE.IcosahedronGeometry(0.5, 1),
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */
interface GeometricFieldProps {
  /** Controls visibility for theme cross-fade transitions */
  visible?: boolean;
}

export function GeometricField({ visible = true }: GeometricFieldProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const prefersReduced = useRef(false);
  const smoothLineCount = useRef(0);

  /* Entrance animation state */
  const fadeRef = useRef(0);
  const startTime = useRef(-1);

  /* Scroll parallax */
  const scrollY = useRef(0);

  /* Inter-shape attraction offsets */
  const attractionOffsets = useRef<{ x: number; y: number }[]>([]);

  /* Theme transition */
  const transitionOpacity = useRef(visible ? 1 : 0);
  const paused = useRef(!visible);

  /* Adaptive quality */
  const slowFrames = useRef(0);
  const fastFrames = useRef(0);
  const qualityReduced = useRef(false);

  const mobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const shapeCount = mobile ? SHAPE_COUNT_MOBILE : SHAPE_COUNT_DESKTOP;
  const dustCount = mobile ? DUST_COUNT_MOBILE : DUST_COUNT_DESKTOP;
  const totalCount = shapeCount + dustCount;
  const maxLines = mobile ? MAX_LINES_MOBILE : MAX_LINES_DESKTOP;
  const interactionRadius = mobile ? INTERACTION_RADIUS_MOBILE : INTERACTION_RADIUS_DESKTOP;
  const geometries = useMemo(() => createGeometries(), []);

  /* ── Connection-line buffer (pre-allocated, updated each frame) ── */
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(linePositions, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', attr);
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePositions]);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
      }),
    [],
  );

  /* ── Generate shape + dust configs ── */
  const shapes = useMemo<ShapeConfig[]>(() => {
    const configs: ShapeConfig[] = [];

    /* Main shapes — tighter distribution for immersion */
    for (let i = 0; i < shapeCount; i++) {
      const kind = KINDS[i % KINDS.length];
      const angle = (i / shapeCount) * Math.PI * 2;
      const radius = mobile ? 1.0 + Math.random() * 5 : 1.0 + Math.random() * 5.5;
      const xJitter = mobile ? (Math.random() - 0.5) * 2.5 : (Math.random() - 0.5) * 3.5;
      const x = Math.cos(angle) * radius + xJitter;
      const y = (Math.random() - 0.5) * (mobile ? 10 : 8);
      const z = -5 + Math.random() * 7;
      const isWireframe = kind === 'cube' || kind === 'octahedron';

      const depthScale = THREE.MathUtils.mapLinear(z, -5, 2, 0.25, 0.9);
      const baseScale = (0.3 + Math.random() * 0.6) * depthScale;
      const depthOpacityMult = THREE.MathUtils.mapLinear(z, -5, 2, 0.5, 1.0);
      /* Increased base opacity: wireframe 0.45, solid 0.35 */
      const baseOp = (isWireframe ? 0.45 : 0.35) * depthOpacityMult;

      configs.push({
        kind,
        basePosition: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: baseScale,
        rotationSpeed: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        floatSeed: Math.random() * 100,
        color: SHAPE_COLORS[i % SHAPE_COLORS.length],
        wireframe: isWireframe,
        baseOpacity: baseOp,
      });
    }

    /* Dust particles — tiny icosahedrons filling spatial gaps */
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = mobile ? 0.5 + Math.random() * 6 : 0.5 + Math.random() * 8;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * (mobile ? 12 : 10);
      const z = -4 + Math.random() * 5;

      configs.push({
        kind: 'sphere',
        basePosition: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.08 + Math.random() * 0.07,
        rotationSpeed: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3],
        floatSeed: Math.random() * 100,
        color: SHAPE_COLORS[i % SHAPE_COLORS.length],
        wireframe: false,
        baseOpacity: 0.15 + Math.random() * 0.1,
        isDust: true,
      });
    }

    return configs;
  }, [shapeCount, dustCount, mobile]);

  /* ── Mouse / touch / scroll handlers ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      mouseTarget.current.x = (t.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(t.clientY / window.innerHeight) * 2 + 1;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseTarget.current.x = 0;
    mouseTarget.current.y = 0;
  }, []);

  const handleScroll = useCallback(() => {
    scrollY.current = window.scrollY / window.innerHeight;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;
    const onMq = (e: MediaQueryListEvent) => {
      prefersReduced.current = e.matches;
    };
    mq.addEventListener('change', onMq);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      mq.removeEventListener('change', onMq);
    };
  }, [handleMouseMove, handleTouchMove, handleTouchEnd, handleScroll]);

  /* Resume rendering when becoming visible */
  useEffect(() => {
    if (visible) {
      paused.current = false;
    }
  }, [visible]);

  /* ═════════════════════════════════════════════════════════════════
     Per-frame animation
     ═════════════════════════════════════════════════════════════════ */
  useFrame((state, delta) => {
    /* ── Theme transition opacity ── */
    const targetVis = visible ? 1 : 0;
    transitionOpacity.current += (targetVis - transitionOpacity.current) * 0.03;

    if (transitionOpacity.current < 0.01 && !visible) {
      paused.current = true;
      lineGeometry.setDrawRange(0, 0);
      return;
    }
    if (paused.current) return;

    const t = state.clock.elapsedTime;
    const reduced = prefersReduced.current;
    const tOp = transitionOpacity.current;

    /* ── Adaptive quality ── */
    if (delta > 0.02) {
      slowFrames.current++;
      fastFrames.current = 0;
      if (slowFrames.current > 30) qualityReduced.current = true;
    } else if (delta < 0.014) {
      fastFrames.current++;
      slowFrames.current = 0;
      if (fastFrames.current > 30) qualityReduced.current = false;
    }
    const effectiveMaxLines = qualityReduced.current
      ? Math.floor(maxLines * 0.7)
      : maxLines;

    /* ── Entrance animation ── */
    if (startTime.current < 0) startTime.current = t;
    const elapsed = t - startTime.current;
    if (fadeRef.current < 1) {
      fadeRef.current = Math.min(1, elapsed / 2.5);
    }

    /* ── Smooth mouse ── */
    const lerpFactor = reduced ? 0.01 : mobile ? 0.04 : 0.07;
    mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * lerpFactor;
    mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * lerpFactor;

    const mx = mouseSmooth.current.x * (mobile ? 4 : 5);
    const my = mouseSmooth.current.y * (mobile ? 3 : 4);
    const sy = scrollY.current;

    /* ── Attraction offsets (initialize if needed) ── */
    if (attractionOffsets.current.length !== totalCount) {
      attractionOffsets.current = Array.from({ length: totalCount }, () => ({ x: 0, y: 0 }));
    }

    /* ── Compute inter-shape attraction (desktop only, main shapes only) ── */
    if (!reduced && !mobile) {
      for (let i = 0; i < totalCount; i++) {
        attractionOffsets.current[i].x *= ATTRACTION_DECAY;
        attractionOffsets.current[i].y *= ATTRACTION_DECAY;
      }

      const step = qualityReduced.current ? 2 : 1;
      for (let i = 0; i < shapeCount; i += step) {
        const mi = meshRefs.current[i];
        if (!mi) continue;

        let neighborCount = 0;
        for (let j = 0; j < shapeCount && neighborCount < MAX_NEIGHBORS; j++) {
          if (i === j) continue;
          const mj = meshRefs.current[j];
          if (!mj) continue;

          const dx = mj.position.x - mi.position.x;
          const dy = mj.position.y - mi.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_CONNECT_DIST && dist > 0.1) {
            attractionOffsets.current[i].x += (dx / dist) * ATTRACTION_STRENGTH;
            attractionOffsets.current[i].y += (dy / dist) * ATTRACTION_STRENGTH;
            neighborCount++;
          }
        }
      }
    }

    /* ── Update each shape ── */
    for (let i = 0; i < totalCount; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const cfg = shapes[i];
      const { floatSeed, rotationSpeed, basePosition } = cfg;

      /* Per-shape staggered entrance: 40ms delay per shape, 800ms to appear */
      const staggerDelay = i * 0.04;
      const shapeElapsed = Math.max(0, elapsed - staggerDelay);
      const rawFade = Math.min(1, shapeElapsed / 0.8);
      const entranceScale = rawFade * rawFade * (3 - 2 * rawFade); // smoothstep

      /* Ambient float */
      const floatMult = mobile ? 0.7 : 1.0;
      const floatX = Math.sin(t * 0.4 + floatSeed) * 0.15 * floatMult;
      const floatY = Math.cos(t * 0.3 + floatSeed * 1.3) * 0.12 * floatMult;
      const floatZ = Math.sin(t * 0.2 + floatSeed * 0.7) * 0.08 * floatMult;

      /* Scroll parallax — deeper shapes scroll slower */
      const parallaxFactor = 0.3 + (basePosition[2] + 5) * 0.07;
      const scrollOffset = -sy * parallaxFactor * 2.0;

      /* Attraction offset (main shapes only) */
      const attrX = cfg.isDust ? 0 : (attractionOffsets.current[i]?.x ?? 0);
      const attrY = cfg.isDust ? 0 : (attractionOffsets.current[i]?.y ?? 0);

      mesh.position.set(
        basePosition[0] + floatX + attrX,
        basePosition[1] + floatY + scrollOffset + attrY,
        basePosition[2] + floatZ,
      );

      /* ── Cursor proximity — visual effects only ── */
      let proximity = 0;
      if (!reduced) {
        const dx = mx - basePosition[0];
        const dy = my - basePosition[1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius && dist > 0.01) {
          const raw = 1 - dist / interactionRadius;
          proximity = raw * raw * (3 - 2 * raw);
        }
      }

      /* Rotation — subtly faster near cursor */
      const rotMult = 1 + proximity * 1.8;
      mesh.rotation.x += rotationSpeed[0] * 0.003 * rotMult;
      mesh.rotation.y += rotationSpeed[1] * 0.003 * rotMult;
      mesh.rotation.z += rotationSpeed[2] * 0.002 * rotMult;

      /* Scale — entrance + proximity breathe + transition */
      const targetScale = cfg.scale * (1 + proximity * 0.35) * entranceScale;
      const currentScale = mesh.scale.x;
      mesh.scale.setScalar(currentScale + (targetScale - currentScale) * 0.06);

      /* Material — emissive glow + opacity with entrance and transition */
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const targetEmissive = proximity * 0.5;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.04;
      /* Increased proximity opacity boost (0.45) with entrance and transition fade */
      const targetOpacity = (cfg.baseOpacity + proximity * 0.45) * entranceScale * tOp;
      mat.opacity += (targetOpacity - mat.opacity) * 0.06;
    }

    /* ── Update connection lines ── */
    let lineCount = 0;

    if (!reduced) {
      for (let i = 0; i < shapeCount && lineCount < effectiveMaxLines; i++) {
        const mi = meshRefs.current[i];
        if (!mi) continue;

        const dxi = mi.position.x - mx;
        const dyi = mi.position.y - my;
        const distI = Math.sqrt(dxi * dxi + dyi * dyi);
        if (distI > CURSOR_LINE_RADIUS) continue;

        for (let j = i + 1; j < shapeCount && lineCount < effectiveMaxLines; j++) {
          const mj = meshRefs.current[j];
          if (!mj) continue;

          const dxj = mj.position.x - mx;
          const dyj = mj.position.y - my;
          const distJ = Math.sqrt(dxj * dxj + dyj * dyj);
          if (distJ > CURSOR_LINE_RADIUS) continue;

          const shapeDist = mi.position.distanceTo(mj.position);
          if (shapeDist < LINE_CONNECT_DIST) {
            const idx = lineCount * 6;
            linePositions[idx] = mi.position.x;
            linePositions[idx + 1] = mi.position.y;
            linePositions[idx + 2] = mi.position.z;
            linePositions[idx + 3] = mj.position.x;
            linePositions[idx + 4] = mj.position.y;
            linePositions[idx + 5] = mj.position.z;
            lineCount++;
          }
        }
      }
    }

    lineGeometry.attributes.position.needsUpdate = true;

    smoothLineCount.current += (lineCount - smoothLineCount.current) * 0.06;
    const visibleLines = Math.min(Math.round(smoothLineCount.current), lineCount);
    lineGeometry.setDrawRange(0, visibleLines * 2);

    /* Increased line opacity (0.20 base) with transition */
    lineMaterial.opacity = (0.20 + Math.sin(t * 1.5) * 0.06) * tOp;

    /* ── Camera parallax — desktop only ── */
    if (!reduced && !mobile) {
      const cam = state.camera;
      cam.position.x += (mouseSmooth.current.x * 0.3 - cam.position.x) * 0.02;
      cam.position.y += (mouseSmooth.current.y * 0.2 - cam.position.y) * 0.02;
      cam.lookAt(0, 0, 0);
    }
  });

  /* ═════════════════════════════════════════════════════════════════
     JSX — shapes + dust + connection lines
     ═════════════════════════════════════════════════════════════════ */
  return (
    <group>
      {shapes.map((config, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometries[config.kind]}
          position={config.basePosition}
          rotation={config.rotation}
          scale={0.001}
        >
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={0}
            transparent
            opacity={0}
            wireframe={config.wireframe}
            roughness={0.55}
            metalness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <lineSegments geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
}
