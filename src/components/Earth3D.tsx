import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function RotatingEarth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      
      // Subtle pulsing glow effect
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.3}
          metalness={0.2}
          emissive="#7DD3FC"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Outer glow effect */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#7DD3FC"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Inner atmosphere */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#BFDBFE"
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
}

export default function Earth3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#7DD3FC" />
        <RotatingEarth />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
