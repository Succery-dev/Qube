import React, { useRef, Suspense } from "react";

// Custom Components Imports
import CanvasLoader from "./CanvasLoader";

// 3D assets and packages Imports
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  RenderTexture,
  Image,
  PerspectiveCamera,
} from "@react-three/drei";
import { TextureLoader, RepeatWrapping } from "three";

const NftCube = ({
  nftCollectionImageUrl,
}: {
  nftCollectionImageUrl: string;
}): JSX.Element => {
  // Refs
  const cubeRef = useRef<THREE.Mesh>(null);
  const imgRef = useRef(null);

  const directionalLightRef_1 = useRef<THREE.DirectionalLight>(null);
  const directionalLightRef_2 = useRef<THREE.DirectionalLight>(null);

  // useHelper(directionalLightRef_1, THREE.DirectionalLightHelper);
  // useHelper(directionalLightRef_2, THREE.DirectionalLightHelper);

  const { camera } = useThree();

  const textureLoader = new TextureLoader();
  const DEMO_TEXTURE_URL = nftCollectionImageUrl;

  const texture = textureLoader.load(DEMO_TEXTURE_URL);
  texture.wrapS = RepeatWrapping;
  texture.repeat.set(1, 1);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const image = imgRef.current;
    const cube = cubeRef.current;
    const directionalLight_1 = directionalLightRef_1.current;
    const directionalLight_2 = directionalLightRef_2.current;

    camera.position.set(0, 4.5, 8.9);
    camera.lookAt(0, 0, 0);

    directionalLight_1.position.set(-3.3, -1.9, 0.6);
    directionalLight_1.lookAt(0, 0, 0);

    directionalLight_2.position.set(3.3, -1.9, 0.6);
    directionalLight_2.lookAt(0, 0, 0);

    if (image) {
      image.position.z = Math.sin(elapsedTime) / 20;
    }

    if (cube) {
      cube.rotation.y += 0.01;
    }
  });
  return (
    <>
      <mesh scale={1.5} ref={cubeRef}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.2} metalness={0.9}>
          <RenderTexture
            attach="map"
            anisotropy={16}
            sourceFile={undefined as unknown as string}
          >
            <PerspectiveCamera
              makeDefault
              manual
              aspect={1 / 1}
              position={[0, 0, 1]}
            />

            <Image url={DEMO_TEXTURE_URL} ref={imgRef} />
          </RenderTexture>
        </meshStandardMaterial>
      </mesh>

      {/* Lighting */}
      <ambientLight color="#fff" intensity={0.7} />
      <rectAreaLight
        width={2}
        height={2}
        color="#fff"
        intensity={70}
        position={[2, 2, 2]}
      />
      <rectAreaLight
        width={2}
        height={2}
        color="#fff"
        intensity={70}
        position={[-2, -2, -2]}
      />

      <directionalLight color="#fff" intensity={3} position={[0, 1, 1]} />
      <directionalLight
        color="#2563EB"
        intensity={0.5}
        ref={directionalLightRef_1}
      />

      <directionalLight
        color="#00ffff"
        intensity={0.5}
        ref={directionalLightRef_2}
      />
    </>
  );
};

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
    <>
      <mesh ref={logoRef} position={[0, -0.4, 0]}>
        <primitive object={logo.scene} />
      </mesh>

      <directionalLight color="#00FFFF" position={[0, 0, -5]} intensity={1} />
      <directionalLight color={"#00FFFF"} position={[0, 5, 0]} intensity={1} />
      <directionalLight color={"#00FFFF"} position={[0, -5, 0]} intensity={1} />
      <ambientLight color="#4d7ee9" intensity={1} />
      <directionalLight color="#2563EB" position={[0, 0, 5]} intensity={1} />
    </>
  );
};

// 3D Scene Configurations
const LogoCanvas = ({
  nftCollectionImageUrl,
}: {
  nftCollectionImageUrl?: string;
}): JSX.Element => {
  return (
    <Canvas camera={{ position: [10, 0, 0], fov: 25 }}>
      {/* 3D Model */}
      <Suspense fallback={<CanvasLoader />}>
        {nftCollectionImageUrl ? (
          <NftCube nftCollectionImageUrl={nftCollectionImageUrl} />
        ) : (
          <Logo />
        )}
      </Suspense>

      <OrbitControls
      // enableZoom={false}
      // target={[2.5, 0, 3]}
      // minPolarAngle={Math.PI / 4}
      // maxPolarAngle={(3 * Math.PI) / 4}
      // minAzimuthAngle={Math.PI / 4}
      // maxAzimuthAngle={(3 * Math.PI) / 4}
      />
    </Canvas>
  );
};

export default LogoCanvas;
