import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Box, MeshDistortMaterial, Stars, Float } from '@react-three/drei';

function AnimatedGeometry() {
  return (
    <>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere visible args={[1, 100, 200]} scale={1.5} position={[-2, 0, 0]}>
          <MeshDistortMaterial color="#14b8a6" attach="material" distort={0.5} speed={2} roughness={0.2} metalness={0.8}/>
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Torus args={[0.8, 0.3, 16, 100]} position={[2, 1, -1]}>
          <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.8} />
        </Torus>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Box args={[1, 1, 1]} position={[0, -2, -2]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.7} />
        </Box>
      </Float>
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-950 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0ea5e9" />
        <pointLight position={[10, -10, 10]} intensity={1} color="#14b8a6" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <AnimatedGeometry />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-50 dark:to-dark-bg"></div>
    </div>
  );
}
