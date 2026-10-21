import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { AppTheme } from '../types/wedding';

interface ThreeCeremonyRingsProps {
  theme: AppTheme;
}

export const ThreeCeremonyRings: React.FC<ThreeCeremonyRingsProps> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // Hardware/context error fallback
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group holding the ceremony rings
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    // Dynamic metallic materials based on theme
    const isWhite = theme === 'white' || theme === 'white-blue';
    const isBlue = theme === 'blue' || theme === 'dark-blue';

    const goldColor = isBlue ? 0xe2e8f0 : isWhite ? 0xd4af37 : 0xf59e0b;
    const platinumColor = isBlue ? 0x93c5fd : 0xe5e7eb;

    // Ring 1: Groom's classic beveled band
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.42, 32, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: goldColor,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ring1.position.set(-1.6, 0.4, 0);
    ringsGroup.add(ring1);

    // Ring 2: Bride's diamond wedding band intertwined
    const ringGeo2 = new THREE.TorusGeometry(3.0, 0.38, 32, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: platinumColor,
      metalness: 0.92,
      roughness: 0.15,
      envMapIntensity: 1.6,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.y = -Math.PI / 4;
    ring2.position.set(1.6, -0.4, 0.2);
    ringsGroup.add(ring2);

    // Diamond solitaire mount on bride's ring
    const diamondGeo = new THREE.OctahedronGeometry(0.65, 2);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.2,
      ior: 2.4, // Diamond index of refraction
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(1.6, 2.7, 0.2);
    diamond.scale.set(1, 1.2, 1);
    ringsGroup.add(diamond);

    // Prongs holding the diamond
    const prongMat = ringMat2;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const prongGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
      const prong = new THREE.Mesh(prongGeo, prongMat);
      prong.position.set(
        1.6 + Math.cos(angle) * 0.4,
        2.5,
        0.2 + Math.sin(angle) * 0.4
      );
      prong.rotation.z = Math.cos(angle) * 0.2;
      ringsGroup.add(prong);
    }

    // Floating Stardust Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: isWhite ? 0x94a3b8 : isBlue ? 0x60a5fa : 0xfde047,
      transparent: true,
      opacity: isWhite ? 0.35 : 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Atmospheric Lights
    const ambientLight = new THREE.AmbientLight(
      isWhite ? 0xffffff : 0x334155,
      isWhite ? 2.5 : 1.2
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
      isBlue ? 0x3b82f6 : 0xfbbf24,
      2.0
    );
    fillLight.position.set(-10, -8, -6);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.5, 30);
    rimLight.position.set(0, 8, 5);
    scene.add(rimLight);

    // Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (e.clientX - halfW) / halfW;
      targetY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Gentle floating spin of ceremony rings
      ringsGroup.rotation.y = elapsed * 0.18 + targetX * 0.4;
      ringsGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.12 - targetY * 0.3;
      ringsGroup.position.y = Math.sin(elapsed * 0.6) * 0.4;

      // Slow particle drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      renderer?.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-85 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
