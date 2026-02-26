import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Bar Chart
function Bar3D({ position, height, color, label, value }) {
  const barRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!barRef.current) return;
    
    const targetScale = hovered ? 1.1 : 1;
    barRef.current.scale.x += (targetScale - barRef.current.scale.x) * 0.1;
    barRef.current.scale.z += (targetScale - barRef.current.scale.z) * 0.1;
    
    // Gentle floating animation
    barRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
  });

  return (
    <group position={position}>
      <mesh
        ref={barRef}
        position={[0, height / 2, 0]}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.6, height, 0.6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Top cap */}
      <mesh position={[0, height, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>

      {/* Value */}
      {hovered && (
        <Text
          position={[0, height + 0.5, 0]}
          fontSize={0.25}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {value}
        </Text>
      )}
    </group>
  );
}

// Main 3D Chart Component
export default function Chart3D({ data = [], maxValue = 100 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  const spacing = 1.5;
  const startX = -(data.length - 1) * spacing / 2;

  return (
    <div style={{
      width: '100%',
      height: '300px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.3)',
      marginTop: '10px'
    }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,50,100,0.4) 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00ABE4" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={0.8}
          castShadow
        />

        <group ref={groupRef}>
          {/* 3D Bars */}
          {data.map((item, index) => (
            <Bar3D
              key={index}
              position={[startX + index * spacing, 0, 0]}
              height={(item.value / maxValue) * 4}
              color={item.color || '#00ABE4'}
              label={item.label}
              value={item.value}
            />
          ))}

          {/* Grid floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20, 20, 20]} />
            <meshStandardMaterial
              color="#001a33"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        </group>

        {/* Fog for depth */}
        <fog attach="fog" args={['#000a1a', 5, 15]} />
      </Canvas>
    </div>
  );
}
