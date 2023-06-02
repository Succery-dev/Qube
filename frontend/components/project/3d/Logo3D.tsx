import React, { useRef, Suspense } from "react";

// Custom Components Imports
import CanvasLoader from "./CanvasLoader";

// 3D assets and packages Imports
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// 3D Logo Aesthetics
const Logo = (): JSX.Element => {
  const logo = useGLTF("/images/3d/Logo.gltf");
  const logoRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const logo = logoRef.current;

    if (logo) {
      logo.position.y = (Math.sin(elapsedTime / 4) - 0.4) / 2;
      logo.rotation.y = Math.sin(elapsedTime / 4) / 4;
      logo.rotation.x = Math.sin(elapsedTime / 4) / 12;
    }
  });

  return (
    <mesh ref={logoRef} position={[0, -0.4, 0]}>
      <primitive object={logo.scene} />
    </mesh>
  );
};

// 3D Scene Configurations
const LogoCanvas = (): JSX.Element => {
  return (
    <Canvas camera={{ position: [10, 0, 0], fov: 25 }}>
      {/* Lighting */}
      {/* TODO: An error occurs with this below on Vercel. (Issue: #65) */}
      {/* <ambientLight color="#4d7ee9" intensity={1} /> */}
      {/* <ambientLight intensity={1} /> */}
      <directionalLight color="#2563EB" position={[0, 0, 5]} />
      <directionalLight color="#00FFFF" position={[0, 0, -5]} />
      <directionalLight color="#00FFFF" position={[0, 5, 0]} />
      <directionalLight color="#00FFFF" position={[0, -5, 0]} />
      <rectAreaLight
        width={5}
        height={5}
        color="#fff"
        intensity={2}
        position={[5, 0, 1]}
      />

      {/* 3D Model */}
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          // target={[2.5, 0, 3]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          minAzimuthAngle={Math.PI / 4}
          maxAzimuthAngle={(3 * Math.PI) / 4}
        />

        <Logo />
      </Suspense>
    </Canvas>
  );
};

export default LogoCanvas;
