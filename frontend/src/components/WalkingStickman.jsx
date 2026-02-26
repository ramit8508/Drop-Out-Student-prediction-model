import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Blocky Stickman Component
function StickmanModel({ riskLevel }) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const bookRef = useRef();
  const frameCount = useRef(0);
  
  // Determine color based on risk level
  const color = useMemo(() => {
    switch(riskLevel) {
      case 'high': return '#ff3333'; // Red
      case 'medium': return '#ffbb33'; // Yellow/Orange
      case 'low': return '#33ff77'; // Green
      default: return '#00ABE4'; // Blue (initial - matching your brand)
    }
  }, [riskLevel]);

  // Determine speed based on risk level
  const speed = useMemo(() => {
    switch(riskLevel) {
      case 'high': return 0.005; // Very slow
      case 'medium': return 0.025; // Slow walk
      case 'low': return 0.04; // Fast walk
      default: return 0.03; // Normal walk
    }
  }, [riskLevel]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Performance: Update every 3 frames (~20fps) for better scroll performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;

    const time = state.clock.getElapsedTime();
    
    // Move stickman from left to right
    groupRef.current.position.x += speed;
    
    // Reset position when off screen
    if (groupRef.current.position.x > 15) {
      groupRef.current.position.x = -15;
    }

    // Walking animation - only if not in high risk
    if (riskLevel !== 'high') {
      const walkCycle = time * (speed * 15);
      
      // Leg animation - natural walking motion
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(walkCycle) * 0.6;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = Math.sin(walkCycle + Math.PI) * 0.6;
      }
      
      // Arm animation (opposite of legs) - left arm swings
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(walkCycle + Math.PI) * 0.4;
      }
      if (rightArmRef.current) {
        // Right arm holds book, minimal movement
        rightArmRef.current.rotation.x = Math.sin(walkCycle) * 0.1;
      }
      
      // Slight vertical bobbing for realistic walk
      groupRef.current.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.15;
      
      // Slight rotation when walking for realism
      groupRef.current.rotation.z = Math.sin(walkCycle) * 0.03;
    } else {
      // High risk - sitting/stopped position
      groupRef.current.position.y = -0.3;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 1.4;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 1.4;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
    }

    // Slow down near center (around the button area) for medium risk
    const distanceFromCenter = Math.abs(groupRef.current.position.x);
    if (distanceFromCenter < 3 && riskLevel === 'medium') {
      // Extra slow when passing button in medium risk
      groupRef.current.position.x -= speed * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[-15, 0, 0]} scale={1.5}>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7}
        />
      </mesh>

      {/* Body/Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 1, 0.35]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.7}
        />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.65, 0.1]} castShadow>
          <boxGeometry args={[0.18, 0.1, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.5, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.65, 0.1]} castShadow>
          <boxGeometry args={[0.18, 0.1, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.4, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.14, 0.6, 0.14]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Right Arm (holding book) */}
      <group ref={rightArmRef} position={[0.35, 1.4, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.14, 0.6, 0.14]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Book in hand - simplified */}
        <group ref={bookRef} position={[0.25, -0.5, 0.2]} rotation={[0.4, 0, 0.3]}>
          {/* Book cover */}
          <mesh>
            <boxGeometry args={[0.3, 0.4, 0.06]} />
            <meshStandardMaterial color="#6B4423" roughness={0.7} />
          </mesh>
          {/* Book pages */}
          <mesh position={[0, 0, -0.03]}>
            <boxGeometry args={[0.28, 0.38, 0.05]} />
            <meshStandardMaterial color="#FFF8DC" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Main Canvas Component
export default function WalkingStickman({ riskLevel = 'initial' }) {
  return (
    <div style={{ 
      position: 'absolute', 
      width: '100%', 
      height: '150px', 
      top: '160px', 
      left: 0,
      zIndex: 10,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 1, 12], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        dpr={[1, 1]}
      >
        {/* Simplified Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Stickman */}
        <StickmanModel riskLevel={riskLevel} />
      </Canvas>
    </div>
  );
}
