
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars } from '@react-three/drei';

export const Sun = () => {
  return (
    <group position={[6, 4, -5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1.5} />
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#FDB813" 
          emissive="#FDB813"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};

export const Moon = () => {
  return (
    <group position={[6, 4, -5]}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-5, 2, 5]} intensity={0.5} color="#b0c4de" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh rotation={[0, -0.5, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial 
          color="#f4f6f0" 
          emissive="#444"
          emissiveIntensity={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export const Clouds = () => {
  return (
    <group>
      <ambientLight intensity={0.6} />
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 2, -5]} />
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[5, 0, -10]} color="#dadedf" />
    </group>
  );
};

export const Rain = ({ count = 1000 }) => {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = Math.random() * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.2; // Fall speed
      if (positions[i] < -10) {
        positions[i] = 10;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#aaaaaa" size={0.05} transparent opacity={0.8} />
    </points>
  );
};

export const Snow = ({ count = 1000 }) => {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20; // x
        positions[i * 3 + 1] = Math.random() * 20; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.05; // Fall speed
      positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.002; // Drift
      
      if (positions[i+1] < -10) {
        positions[i+1] = 10;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.1} transparent opacity={0.8} />
    </points>
  );
};
