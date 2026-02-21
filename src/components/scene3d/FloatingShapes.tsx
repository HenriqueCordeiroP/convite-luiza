import { Float, MeshDistortMaterial } from '@react-three/drei';

export function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-4, 2, -3]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <MeshDistortMaterial color="#CB8CC2" transparent opacity={0.5} distort={0.3} speed={2} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[4, 0.5, -4]}>
        <mesh>
          <torusGeometry args={[0.5, 0.18, 16, 32]} />
          <meshStandardMaterial color="#CB8CC2" transparent opacity={0.4} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={3} position={[0, 3, -5]}>
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#3794CF" transparent opacity={0.35} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1} position={[-2, -1, -2]}>
        <mesh>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#7BB1D9" transparent opacity={0.4} />
        </mesh>
      </Float>
    </>
  );
}
