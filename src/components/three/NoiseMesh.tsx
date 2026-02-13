'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_RIPPLES = 8;
const MOUSE_SPREAD_X = 8;
const MOUSE_SPREAD_Y = 5;

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/* ═══════════════════════════════════════════════════════════════════
   GLSL: Simplex 3D Noise — Ashima Arts / Stefan Gustavson
   ═══════════════════════════════════════════════════════════════════ */
const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients: 7x7 points over a square, mapped onto an octahedron
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/* ═══════════════════════════════════════════════════════════════════
   Vertex Shader
   ═══════════════════════════════════════════════════════════════════ */
const vertexShader = /* glsl */ `
${noiseGLSL}

uniform float uTime;
uniform vec2  uMouse;
uniform vec4  uRipples[${MAX_RIPPLES}];

varying vec2  vUv;
varying vec3  vNormal;
varying vec3  vWorldPosition;
varying float vElevation;
varying float vCursorDist;

/* ── Layered noise (4 octaves) ── */
float baseNoise(vec2 p, float t) {
  float d  = snoise(vec3(p * 0.25, t * 0.12)) * 1.0;
  d += snoise(vec3(p * 0.5  + 43.0,  t * 0.08 + 10.0)) * 0.5;
  d += snoise(vec3(p * 1.0  + 97.0,  t * 0.15 + 20.0)) * 0.25;
  d += snoise(vec3(p * 2.0  + 151.0, t * 0.20 + 30.0)) * 0.125;
  return d;
}

/* ── Cursor magnet — gaussian bulge toward cursor ── */
float magnetEffect(vec2 p, vec2 mouse) {
  float d = distance(p, mouse);
  return exp(-d * d * 0.06) * 1.8;
}

/* ── Click ripples — expanding ring waves ── */
float rippleEffect(vec2 p, float t) {
  float sum = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    if (uRipples[i].w > 0.5) {
      float rd  = distance(p, uRipples[i].xy);
      float age = t - uRipples[i].z;
      if (age > 0.0 && age < 5.0) {
        float radius = age * 3.5;
        float fade   = exp(-age * 1.2);
        float width  = 0.8 + age * 0.3;
        float ring   = smoothstep(width, 0.0, abs(rd - radius));
        sum += sin(rd * 4.0 - age * 10.0) * ring * fade * 0.6;
      }
    }
  }
  return sum;
}

/* ── Total displacement ── */
float totalDisp(vec2 p, float t, vec2 mouse) {
  float breathe = 0.85 + 0.15 * sin(t * 0.3);
  return baseNoise(p, t) * breathe + magnetEffect(p, mouse) + rippleEffect(p, t);
}

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 mouseWorld = uMouse * vec2(${MOUSE_SPREAD_X}.0, ${MOUSE_SPREAD_Y}.0);

  // Displacement
  float d = totalDisp(pos.xy, uTime, mouseWorld);
  pos.z += d;
  vElevation  = d;
  vCursorDist = distance(pos.xy, mouseWorld);

  // Analytic-ish normal via finite differences
  float eps = 0.05;
  float dx  = totalDisp(pos.xy + vec2(eps, 0.0), uTime, mouseWorld) - d;
  float dy  = totalDisp(pos.xy + vec2(0.0, eps), uTime, mouseWorld) - d;
  vNormal = normalize(vec3(-dx / eps, -dy / eps, 1.0));

  vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position    = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

/* ═══════════════════════════════════════════════════════════════════
   Fragment Shader — iridescent gold with cursor glow
   ═══════════════════════════════════════════════════════════════════ */
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2  uMouse;
uniform float uFadeIn;

varying vec2  vUv;
varying vec3  vNormal;
varying vec3  vWorldPosition;
varying float vElevation;
varying float vCursorDist;

void main() {
  /* ── Palette ── */
  vec3 deepGold  = vec3(0.788, 0.659, 0.298);   // #c9a84c
  vec3 lightGold = vec3(0.910, 0.835, 0.627);   // #e8d5a0
  vec3 cream     = vec3(0.941, 0.902, 0.827);   // #f0e6d3
  vec3 dark      = vec3(0.060, 0.050, 0.040);

  /* ── Vectors ── */
  vec3 n       = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

  /* ── Two-light specular for rich highlights ── */
  vec3  L1 = normalize(vec3( 0.3,  0.5, 1.0));
  vec3  L2 = normalize(vec3(-0.5, -0.3, 0.8));
  vec3  H1 = normalize(L1 + viewDir);
  vec3  H2 = normalize(L2 + viewDir);
  float diff  = max(dot(n, L1), 0.0) * 0.6 + max(dot(n, L2), 0.0) * 0.3;
  float spec1 = pow(max(dot(n, H1), 0.0), 80.0);
  float spec2 = pow(max(dot(n, H2), 0.0), 60.0);

  /* ── Base color from elevation + diffuse ── */
  float elev = clamp(vElevation * 0.25 + 0.5, 0.0, 1.0);
  vec3  color = mix(dark, deepGold * 0.5, elev);
  color += deepGold * diff * 0.4;

  /* ── Fresnel iridescence ── */
  color = mix(color, lightGold, fresnel * 0.4);
  color = mix(color, cream, fresnel * fresnel * 0.2);

  /* ── Specular highlights ── */
  color += cream     * spec1 * 0.6;
  color += lightGold * spec2 * 0.35;

  /* ── Cursor glow ── */
  float glow = exp(-vCursorDist * vCursorDist * 0.03) * 0.6;
  color += deepGold  * glow;
  color += lightGold * glow * fresnel * 0.5;

  /* ── Edge vignette (fade mesh borders to transparent) ── */
  float edgeFade = smoothstep(1.0, 0.35, max(abs(vUv.x - 0.5) * 2.0, abs(vUv.y - 0.5) * 2.0));

  /* ── Final alpha ── */
  float alpha = (0.06 + elev * 0.2 + fresnel * 0.12 + glow * 0.35 + (spec1 + spec2) * 0.25)
                * edgeFade * uFadeIn;

  gl_FragColor = vec4(color, alpha);
}
`;

/* ═══════════════════════════════════════════════════════════════════
   React component
   ═══════════════════════════════════════════════════════════════════ */
export function NoiseMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const clockRef = useRef(0);
  const fadeRef = useRef(0);
  const rippleIndex = useRef(0);
  const prefersReduced = useRef(false);

  const mobile = useMemo(isMobile, []);
  const segX = mobile ? 64 : 150;
  const segY = mobile ? 40 : 90;

  /* Ripple buffer (ring buffer of Vector4s) */
  const ripples = useMemo(
    () => Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, 0)),
    [],
  );

  /* Shader uniforms */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRipples: { value: ripples },
      uFadeIn: { value: 0 },
    }),
    [ripples],
  );

  /* ── Mouse move ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  /* ── Touch move (mobile) ── */
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

  /* ── Click / tap → spawn ripple ── */
  const spawnRipple = useCallback(
    (clientX: number, clientY: number) => {
      if (prefersReduced.current) return;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      const idx = rippleIndex.current % MAX_RIPPLES;
      ripples[idx].set(x * MOUSE_SPREAD_X, y * MOUSE_SPREAD_Y, clockRef.current, 1);
      rippleIndex.current++;
    },
    [ripples],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => spawnRipple(e.clientX, e.clientY),
    [spawnRipple],
  );

  /* ── Touch start → spawn ripple (mobile equivalent of click) ── */
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnRipple(t.clientX, t.clientY);
    },
    [spawnRipple],
  );

  /* ── Event listeners ── */
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;
    const onMq = (e: MediaQueryListEvent) => {
      prefersReduced.current = e.matches;
    };
    mq.addEventListener('change', onMq);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      mq.removeEventListener('change', onMq);
    };
  }, [handleMouseMove, handleClick, handleTouchMove, handleTouchStart, handleTouchEnd]);

  /* ── Per-frame animation ── */
  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    clockRef.current = t;
    const reduced = prefersReduced.current;

    // Fade in over ~2 s
    if (fadeRef.current < 1) {
      fadeRef.current = Math.min(1, fadeRef.current + delta * 0.5);
    }

    // Smooth mouse (lower lerp = smoother trailing; even slower on mobile touch)
    const lerpSpeed = reduced ? 0.01 : mobile ? 0.035 : 0.06;
    mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * lerpSpeed;
    mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * lerpSpeed;

    // Update uniforms
    const u = materialRef.current.uniforms;
    u.uTime.value = t * (reduced ? 0.15 : 1);
    u.uMouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y);
    u.uFadeIn.value = fadeRef.current;

    // Deactivate expired ripples
    for (let i = 0; i < MAX_RIPPLES; i++) {
      if (ripples[i].w > 0.5 && t - ripples[i].z > 5) {
        ripples[i].w = 0;
      }
    }

    // Subtle camera parallax — desktop only (no persistent cursor on mobile)
    if (!reduced && !mobile) {
      const cam = state.camera;
      cam.position.x += (mouseSmooth.current.x * 0.3 - cam.position.x) * 0.02;
      cam.position.y += (mouseSmooth.current.y * 0.2 - cam.position.y) * 0.02;
      cam.lookAt(0, 0, 0);
    }
  });

  return (
    <mesh position={[0, 0, -1]} rotation={[-0.12, 0, 0]}>
      <planeGeometry args={[22, 14, segX, segY]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
