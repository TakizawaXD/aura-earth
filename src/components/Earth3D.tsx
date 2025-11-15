import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function RotatingEarth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Create realistic Earth texture using a canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Ocean base
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#1a4d7a');
    oceanGradient.addColorStop(0.5, '#2563eb');
    oceanGradient.addColorStop(1, '#1a4d7a');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add continents (simplified shapes)
    ctx.fillStyle = '#22c55e';
    
    // North America
    ctx.beginPath();
    ctx.ellipse(300, 300, 200, 250, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.ellipse(400, 650, 120, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(1000, 500, 180, 300, 0, 0, Math.PI * 2);
    ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.ellipse(1050, 250, 150, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asia
    ctx.beginPath();
    ctx.ellipse(1500, 300, 300, 250, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(1650, 700, 120, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add some random terrain details
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ice caps
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 80 + 40;
      const height = Math.random() * 30 + 20;
      
      ctx.beginPath();
      ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <group>
      {/* Main Earth sphere with realistic texture */}
      <Sphere ref={meshRef} args={[2, 128, 128]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
          emissive="#1e3a8a"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

export default function Earth3D() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-large">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
        <RotatingEarth />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.3}
        />
      </Canvas>
    </div>
  );
}
