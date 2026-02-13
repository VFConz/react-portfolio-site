'use client';
import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_DESKTOP = 4000;
const PARTICLE_COUNT_MOBILE = 1500;

function getParticleCount() {
  if (typeof window === 'undefined') return PARTICLE_COUNT_DESKTOP;
  return window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
}

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particleCount = useMemo(getParticleCount, []);

  // Track mouse position in normalized coordinates
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const { positions, basePositions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Primary accent: #6366f1 -> rgb(99, 102, 241)
    const accentR = 99 / 255;
    const accentG = 102 / 255;
    const accentB = 241 / 255;

    // Secondary color: soft cyan/violet #a78bfa -> rgb(167, 139, 250)
    const secondR = 167 / 255;
    const secondG = 139 / 255;
    const secondB = 250 / 255;

    // Tertiary: white sparkle
    const whiteR = 0.9;
    const whiteG = 0.92;
    const whiteB = 1.0;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distribute particles in a sphere-like volume
      const radius = Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 2;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      // Color variation: 70% accent, 20% secondary, 10% white sparkle
      const colorRand = Math.random();
      const brightness = 0.5 + Math.random() * 0.5;

      if (colorRand < 0.7) {
        colors[i3] = accentR * brightness;
        colors[i3 + 1] = accentG * brightness;
        colors[i3 + 2] = accentB * brightness;
      } else if (colorRand < 0.9) {
        colors[i3] = secondR * brightness;
        colors[i3 + 1] = secondG * brightness;
        colors[i3 + 2] = secondB * brightness;
      } else {
        colors[i3] = whiteR * brightness;
        colors[i3 + 1] = whiteG * brightness;
        colors[i3 + 2] = whiteB * brightness;
      }

      // Varied sizes: most small, a few larger for depth
      const sizeRand = Math.random();
      if (sizeRand < 0.7) {
        sizes[i] = 0.015 + Math.random() * 0.015; // small: 0.015-0.03
      } else if (sizeRand < 0.95) {
        sizes[i] = 0.03 + Math.random() * 0.025; // medium: 0.03-0.055
      } else {
        sizes[i] = 0.06 + Math.random() * 0.03; // large sparkle: 0.06-0.09
      }
    }

    return { positions, basePositions, colors, sizes };
  }, [particleCount]);

  // Add fog for depth
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;

    // Update scroll position from DOM
    if (typeof window !== 'undefined') {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }

    const scrollFactor = scrollRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Gentle floating motion with varied speeds per particle
      const seed = basePositions[i3] + basePositions[i3 + 1];
      const floatX = Math.sin(time * 0.3 + seed * 0.5) * 0.18;
      const floatY = Math.cos(time * 0.2 + seed * 0.7) * 0.18;
      const floatZ = Math.sin(time * 0.25 + seed * 0.3) * 0.12;

      // Spread apart as user scrolls down
      const spreadMultiplier = 1 + scrollFactor * 1.5;

      // Base position with float
      let px = basePositions[i3] * spreadMultiplier + floatX;
      let py = basePositions[i3 + 1] * spreadMultiplier + floatY;
      const pz = basePositions[i3 + 2] * spreadMultiplier + floatZ;

      // Mouse interaction: gentle attraction toward cursor area
      const mouseWorldX = mx * 5;
      const mouseWorldY = my * 4;
      const dx = mouseWorldX - px;
      const dy = mouseWorldY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxInfluence = 4;

      if (dist < maxInfluence) {
        const force = (1 - dist / maxInfluence) * 0.3;
        px += dx * force;
        py += dy * force;
      }

      posArray[i3] = px;
      posArray[i3 + 1] = py;
      posArray[i3 + 2] = pz;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
