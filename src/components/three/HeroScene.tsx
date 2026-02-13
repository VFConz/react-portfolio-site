'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { useThemeStore } from '@/store/theme';
import { NoiseMesh } from './NoiseMesh';
import { GeometricField } from './GeometricField';

export function HeroScene() {
  const theme = useThemeStore((s) => s.theme);

  const mobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, mobile ? 8 : 7],
          fov: mobile ? 75 : 65,
        }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ alpha: true, antialias: !mobile }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lights used by GeometricField's meshStandardMaterial; NoiseMesh ignores them */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} color="#e8d5a0" />

          {theme === 'dark' ? <NoiseMesh /> : <GeometricField />}
        </Suspense>
      </Canvas>
    </div>
  );
}
