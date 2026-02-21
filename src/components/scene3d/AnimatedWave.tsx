import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AnimatedWave() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(
        i,
        Math.sin(x * 0.4 + t * 0.7) * 0.5 +
        Math.cos(y * 0.3 + t * 0.5) * 0.4
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[28, 28, 80, 80]} />
      <meshStandardMaterial color="#3794CF" wireframe transparent opacity={0.12} />
    </mesh>
  );
}
