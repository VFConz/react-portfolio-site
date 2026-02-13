'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { GeometricField } from './GeometricField';

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <GeometricField />
        </Suspense>
      </Canvas>
    </div>
  );
}
