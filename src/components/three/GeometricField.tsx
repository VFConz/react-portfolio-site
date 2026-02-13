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
}

const SHAPE_COUNT_DESKTOP = 30;
const SHAPE_COUNT_MOBILE = 18;

const MAX_LINES_DESKTOP = 120;
const MAX_LINES_MOBILE = 40;
/** Radius (in world-space XY) for cursor proximity visual effects */
const INTERACTION_RADIUS_DESKTOP = 6.0;
const INTERACTION_RADIUS_MOBILE = 8.0; // larger for fat-finger touch
/** Max distance between two shapes for a connection line */
const LINE_CONNECT_DIST = 4.0;
/** Shapes must be within this distance of the cursor to participate in lines */
const CURSOR_LINE_RADIUS = 7.0;

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
export function GeometricField() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const prefersReduced = useRef(false);
  // Smoothed line draw count for gentle fade
  const smoothLineCount = useRef(0);

  const mobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const count = mobile ? SHAPE_COUNT_MOBILE : SHAPE_COUNT_DESKTOP;
  const maxLines = mobile ? MAX_LINES_MOBILE : MAX_LINES_DESKTOP;
  const interactionRadius = mobile ? INTERACTION_RADIUS_MOBILE : INTERACTION_RADIUS_DESKTOP;
  const geometries = useMemo(createGeometries, []);

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
        opacity: 0.18,
        depthWrite: false,
      }),
    [],
  );

  /* ── Generate shape configs — scattered across full depth ── */
  const shapes = useMemo<ShapeConfig[]>(() => {
    const configs: ShapeConfig[] = [];
    for (let i = 0; i < count; i++) {
      const kind = KINDS[i % KINDS.length];
      const angle = (i / count) * Math.PI * 2;
      // Mobile: tighter X, taller Y so shapes stay visible in portrait viewport
      const radius = mobile ? 1.0 + Math.random() * 5 : 1.5 + Math.random() * 7;
      const xJitter = mobile ? (Math.random() - 0.5) * 2.5 : (Math.random() - 0.5) * 4;
      const x = Math.cos(angle) * radius + xJitter;
      const y = (Math.random() - 0.5) * (mobile ? 10 : 8);
      // Deeper Z spread — shapes in both foreground and background
      const z = -5 + Math.random() * 7; // range: -5 to +2
      const isWireframe = kind === 'cube' || kind === 'octahedron';

      // Scale shapes by depth — further shapes slightly smaller
      const depthScale = THREE.MathUtils.mapLinear(z, -5, 2, 0.25, 0.9);
      const baseScale = (0.3 + Math.random() * 0.6) * depthScale;

      // Opacity fades with depth for atmospheric perspective
      const depthOpacityMult = THREE.MathUtils.mapLinear(z, -5, 2, 0.5, 1.0);
      const baseOp = (isWireframe ? 0.3 : 0.22) * depthOpacityMult;

      configs.push({
        kind,
        basePosition: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: baseScale,
        rotationSpeed: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ],
        floatSeed: Math.random() * 100,
        color: SHAPE_COLORS[i % SHAPE_COLORS.length],
        wireframe: isWireframe,
        baseOpacity: baseOp,
      });
    }
    return configs;
  }, [count]);

  /* ── Mouse / touch handlers ── */
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

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

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
      mq.removeEventListener('change', onMq);
    };
  }, [handleMouseMove, handleTouchMove, handleTouchEnd]);

  /* ═════════════════════════════════════════════════════════════════
     Per-frame animation — shapes stay anchored, visual-only cursor FX
     ═════════════════════════════════════════════════════════════════ */
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const reduced = prefersReduced.current;

    // Smooth mouse — slower on mobile for gentler touch tracking
    const lerpFactor = reduced ? 0.01 : mobile ? 0.04 : 0.07;
    mouseSmooth.current.x +=
      (mouseTarget.current.x - mouseSmooth.current.x) * lerpFactor;
    mouseSmooth.current.y +=
      (mouseTarget.current.y - mouseSmooth.current.y) * lerpFactor;

    const mx = mouseSmooth.current.x * (mobile ? 4 : 5);
    const my = mouseSmooth.current.y * (mobile ? 3 : 4);

    /* ── Update each shape — NO position displacement ── */
    for (let i = 0; i < count; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const cfg = shapes[i];
      const { floatSeed, rotationSpeed, basePosition } = cfg;

      // Gentle ambient float (anchored — shapes drift slightly but stay in place)
      // Slightly reduced on mobile for lighter GPU load
      const floatMult = mobile ? 0.7 : 1.0;
      const floatX = Math.sin(t * 0.4 + floatSeed) * 0.15 * floatMult;
      const floatY = Math.cos(t * 0.3 + floatSeed * 1.3) * 0.12 * floatMult;
      const floatZ = Math.sin(t * 0.2 + floatSeed * 0.7) * 0.08 * floatMult;

      // Position = base + gentle float only — NO cursor push
      mesh.position.set(
        basePosition[0] + floatX,
        basePosition[1] + floatY,
        basePosition[2] + floatZ,
      );

      // ── Cursor proximity — visual effects only (no position change) ──
      let proximity = 0;
      if (!reduced) {
        const dx = mx - basePosition[0];
        const dy = my - basePosition[1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius && dist > 0.01) {
          const raw = 1 - dist / interactionRadius;
          // Smooth hermite curve for gentle falloff
          proximity = raw * raw * (3 - 2 * raw);
        }
      }

      // Rotation — subtly faster near cursor
      const rotMult = 1 + proximity * 1.8;
      mesh.rotation.x += rotationSpeed[0] * 0.003 * rotMult;
      mesh.rotation.y += rotationSpeed[1] * 0.003 * rotMult;
      mesh.rotation.z += rotationSpeed[2] * 0.002 * rotMult;

      // Scale — gentle breathe near cursor (lerped for smooth transition)
      const targetScale = cfg.scale * (1 + proximity * 0.35);
      const currentScale = mesh.scale.x;
      mesh.scale.setScalar(currentScale + (targetScale - currentScale) * 0.04);

      // Material — soft emissive glow + opacity boost near cursor
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const targetEmissive = proximity * 0.5;
      mat.emissiveIntensity +=
        (targetEmissive - mat.emissiveIntensity) * 0.04;
      const targetOpacity = cfg.baseOpacity + proximity * 0.35;
      mat.opacity += (targetOpacity - mat.opacity) * 0.04;
    }

    /* ── Update connection lines (fewer on mobile) ── */
    let lineCount = 0;

    if (!reduced) {
      for (let i = 0; i < count && lineCount < maxLines; i++) {
        const mi = meshRefs.current[i];
        if (!mi) continue;

        // Only shapes near cursor participate
        const dxi = mi.position.x - mx;
        const dyi = mi.position.y - my;
        const distI = Math.sqrt(dxi * dxi + dyi * dyi);
        if (distI > CURSOR_LINE_RADIUS) continue;

        for (let j = i + 1; j < count && lineCount < maxLines; j++) {
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

    // Smoothly interpolate the visible line count to prevent pop-in/pop-out
    smoothLineCount.current +=
      (lineCount - smoothLineCount.current) * 0.06;
    const visibleLines = Math.min(
      Math.round(smoothLineCount.current),
      lineCount,
    );
    lineGeometry.setDrawRange(0, visibleLines * 2);

    // Line opacity pulses subtly with time
    lineMaterial.opacity = 0.10 + Math.sin(t * 1.5) * 0.04;

    /* ── Camera parallax — desktop only (no persistent cursor on mobile) ── */
    if (!reduced && !mobile) {
      const cam = state.camera;
      cam.position.x +=
        (mouseSmooth.current.x * 0.3 - cam.position.x) * 0.02;
      cam.position.y +=
        (mouseSmooth.current.y * 0.2 - cam.position.y) * 0.02;
      cam.lookAt(0, 0, 0);
    }
  });

  /* ═════════════════════════════════════════════════════════════════
     JSX — shapes + connection lines
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
          scale={config.scale}
        >
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={0}
            transparent
            opacity={config.baseOpacity}
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
