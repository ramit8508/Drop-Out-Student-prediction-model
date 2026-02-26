import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Risk Sphere with Dynamic Colors
function RiskSphere({ riskScore = 0, riskLevel = 'low' }) {
  const sphereRef = useRef();
  const particlesRef = useRef();
  const [targetScale, setTargetScale] = useState(1);
  const frameCount = useRef(0);
  
  // Color based on risk level
  const { color, emissiveColor } = useMemo(() => {
    switch(riskLevel) {
      case 'high':
        return { color: '#ff3333', emissiveColor: '#ff0000' };
      case 'medium':
        return { color: '#ffbb33', emissiveColor: '#ff8800' };
      case 'low':
        return { color: '#33ff77', emissiveColor: '#00ff44' };
      default:
        return { color: '#00ABE4', emissiveColor: '#0088cc' };
    }
  }, [riskLevel]);

  useEffect(() => {
    setTargetScale(1 + (riskScore / 200));
  }, [riskScore]);

  useFrame((state) => {
    // Performance: Update every 3 frames (~20fps) for better scroll performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    
    if (!sphereRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Pulsing animation based on risk
    const pulseSpeed = riskLevel === 'high' ? 2 : riskLevel === 'medium' ? 1.5 : 1;
    const pulseIntensity = riskLevel === 'high' ? 0.2 : 0.1;
    const pulse = Math.sin(time * pulseSpeed) * pulseIntensity;
    
    // Smooth scale transition
    const currentScale = sphereRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.05;
    sphereRef.current.scale.set(newScale + pulse, newScale + pulse, newScale + pulse);
    
    // Rotation
    sphereRef.current.rotation.y = time * 0.3;
    sphereRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    
    // Particle ring rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -time * 0.5;
      particlesRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Create particle ring
  const particles = useMemo(() => {
    const count = 30; // Reduced from 100 for performance
    const positions = new Float32Array(count * 3);
    const radius = 2.5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const heightVar = (Math.random() - 0.5) * 0.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = heightVar;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    return positions;
  }, []);

  return (
    <group>
      {/* Main Risk Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh scale={0.9}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[1.52, 16, 16]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Particle ring */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Risk Score Text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.ttf"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {Math.round(riskScore)}
      </Text>

      {/* Risk Level Label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {riskLevel.toUpperCase()}
      </Text>

      {/* Orbiting indicators based on risk */}
      {riskLevel !== 'initial' && [...Array(riskLevel === 'high' ? 5 : riskLevel === 'medium' ? 3 : 2)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / (riskLevel === 'high' ? 5 : riskLevel === 'medium' ? 3 : 2)) * Math.PI * 2) * 2.2,
            0,
            Math.sin((i / (riskLevel === 'high' ? 5 : riskLevel === 'medium' ? 3 : 2)) * Math.PI * 2) * 2.2
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Risk Visualization Component
export default function RiskSphere3D({ riskScore = 0, riskLevel = 'low', hasAnalyzed = false }) {
  if (!hasAnalyzed) return null;

  return (
    <div style={{
      width: '100%',
      height: '300px',
      position: 'relative',
      marginBottom: '20px',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transform: 'translateZ(0)',
      willChange: 'transform'
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
      >
        {/* Simplified Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {/* Risk Sphere */}
        <RiskSphere riskScore={riskScore} riskLevel={riskLevel} />

        {/* Interactive camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Overlay info */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        Drag to rotate • Auto-spinning
      </div>
    </div>
  );
}
