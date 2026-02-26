import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Animated Waves Background
function AnimatedWaves({ riskLevel }) {
  const meshRef = useRef();
  
  const color = useMemo(() => {
    switch(riskLevel) {
      case 'high': return new THREE.Color('#ff3333');
      case 'medium': return new THREE.Color('#ffbb33');
      case 'low': return new THREE.Color('#33ff77');
      default: return new THREE.Color('#00ABE4');
    }
  }, [riskLevel]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      const wave1 = Math.sin(x * 0.5 + time * 0.5) * 0.3;
      const wave2 = Math.cos(y * 0.5 + time * 0.3) * 0.2;
      const wave3 = Math.sin((x + y) * 0.3 + time * 0.7) * 0.15;
      
      positions.setZ(i, wave1 + wave2 + wave3);
    }
    
    positions.needsUpdate = true;
    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -5, -10]}>
      <planeGeometry args={[50, 50, 30, 30]} />
      <meshStandardMaterial
        color={color}
        wireframe={false}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 3D Particle Field
function ParticleField({ riskLevel }) {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const count = 50; // Reduced from 200 for performance
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = 1;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.01;
      
      if (positions[i + 1] < -15) {
        positions[i + 1] = 15;
      }
      
      positions[i] += Math.sin(time + i) * 0.001;
      positions[i + 2] += Math.cos(time + i) * 0.001;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.05;
  });

  const particleColor = useMemo(() => {
    switch(riskLevel) {
      case 'high': return '#ff6666';
      case 'medium': return '#ffdd66';
      case 'low': return '#66ffaa';
      default: return '#66d9ff';
    }
  }, [riskLevel]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={particleColor}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating Geometric Shapes
function FloatingShapes({ riskLevel }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });

  const shapeColor = useMemo(() => {
    switch(riskLevel) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa44';
      case 'low': return '#44ff88';
      default: return '#00ABE4';
    }
  }, [riskLevel]);

  return (
    <group ref={groupRef}>
      {/* Floating torus */}
      <mesh position={[-8, 3, -5]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1, 0.3, 16, 50]} />
        <meshStandardMaterial
          color={shapeColor}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floating octahedron */}
      <mesh position={[8, -2, -8]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color={shapeColor}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floating icosahedron */}
      <mesh position={[0, 5, -12]} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={shapeColor}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Floating ring */}
      <mesh position={[-5, -4, -6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color={shapeColor}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Animated Grid Floor
function GridFloor() {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    gridRef.current.position.y = Math.sin(time * 0.5) * 0.3 - 8;
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial
        color="#00ABE4"
        wireframe
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}

// Main 3D Background Scene
export default function Background3D({ riskLevel = 'initial' }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Simplified Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Optimized 3D Elements - Only essential ones */}
        <ParticleField riskLevel={riskLevel} />
        <FloatingShapes riskLevel={riskLevel} />
      </Canvas>
    </div>
  );
}
