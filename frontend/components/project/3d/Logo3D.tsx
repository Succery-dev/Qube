import React, { useRef, Suspense } from "react";

// Custom Components Imports
import CanvasLoader from "./CanvasLoader";

// 3D assets and packages Imports
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

/**
 *
 * @dev CustomScene is not renedering the 3D Logo correctly. Specifically the "QP" in the logo that is expected to be a shade of blue appears white. Therefore, using lights from the @react-three/fiber package.
 */
// Create Custom Scene
// const CustomScene = () => {
//   // This is related to Issue#65.

//   const { scene } = useThree();

//   // AmbientLight
//   const ambientLight = new THREE.AmbientLight(0x4d7ee9, 1);
//   scene.add(ambientLight);

//   // Light1
//   const light1 = new THREE.DirectionalLight(0x2563eb, 1);
//   light1.position.set(0, 0, 5);
//   scene.add(light1);

//   // Light2
//   const light2 = new THREE.DirectionalLight(0x00ffff, 1);
//   light2.position.set(0, 0, -5);
//   scene.add(light2);

//   // Light3
//   const light3 = new THREE.DirectionalLight(0x00ffff, 1);
//   light3.position.set(0, 5, 0);
//   scene.add(light3);

//   // Light4
//   const light4 = new THREE.DirectionalLight(0x00ffff, 1);
//   light4.position.set(0, -5, 0);
//   scene.add(light4);

//   // RectAreaLight
//   const rectAreaLight = new THREE.RectAreaLight(0xfff, 2, 5, 5);
//   rectAreaLight.position.set(5, 0, 1);
//   scene.add(rectAreaLight);

//   return null;
// };

// 3D Scene Configurations
const LogoCanvas = (): JSX.Element => {
  return (
    <Canvas camera={{ position: [10, 0, 0], fov: 25 }}>
      {/* Lighting */}
      <ambientLight color="#4d7ee9" intensity={1} />
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

      {/* Helpers */}
      {/* <axesHelper args={[10]} />
        <gridHelper args={[20]} /> */}

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
