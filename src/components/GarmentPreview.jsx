
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

function GarmentMaterial({ color, roughness = 0.82 }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0}
    />
  );
}

function Sleeve({ side, color, length = 1, width = 0.42 }) {
  const rotation = side === 'left' ? -0.18 : 0.18;

  return (
    <group
      position={[side === 'left' ? -0.94 : 0.94, 0.25, 0]}
      rotation={[0, 0, side === 'left' ? rotation : rotation]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, length, 0.43]} />
        <GarmentMaterial color={color} />
      </mesh>

      <mesh position={[0, -length / 2 + 0.03, 0]}>
        <boxGeometry args={[width + 0.02, 0.08, 0.45]} />
        <GarmentMaterial color={color} />
      </mesh>
    </group>
  );
}

function ShirtBody({ color, oversized = false, jacket = false }) {
  const width = oversized ? 1.75 : jacket ? 1.55 : 1.4;
  const height = jacket ? 1.5 : 1.35;

  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.48]} />
        <GarmentMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.57, 0]}>
        <boxGeometry args={[width, 0.07, 0.49]} />
        <GarmentMaterial color={color} />
      </mesh>

      {jacket && (
        <>
          <mesh position={[0, 0.12, 0.248]}>
            <boxGeometry args={[0.035, 1.25, 0.018]} />
            <meshStandardMaterial color="#777777" />
          </mesh>

          {[-0.3, -0.3 + 0.38, -0.3 + 0.76].map((y, index) => (
            <mesh
              key={index}
              position={[0.04, y, 0.27]}
            >
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#b9a47e" />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

function HoodieDetails({ color }) {
  return (
    <group>
      <mesh position={[0, 0.91, 0]}>
        <torusGeometry args={[0.29, 0.12, 16, 32]} />
        <GarmentMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.12, 0.26]}>
        <boxGeometry args={[0.68, 0.22, 0.04]} />
        <GarmentMaterial color={color} />
      </mesh>

      {[-0.09, 0.09].map((x, index) => (
        <mesh key={index} position={[x, 0.35, 0.27]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
          <meshStandardMaterial color="#d5d0c8" />
        </mesh>
      ))}
    </group>
  );
}

function PoloDetails({ color }) {
  return (
    <group>
      <mesh position={[0, 0.76, 0.25]}>
        <boxGeometry args={[0.36, 0.22, 0.035]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, 0.55, 0.275]}>
        <boxGeometry args={[0.025, 0.35, 0.018]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      {[-0.08, 0.08].map((x, index) => (
        <mesh key={index} position={[x, 0.51, 0.29]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function TopGarment({ type, color }) {
  const oversized = type === 'oversized';
  const hoodie = type === 'hoodie';
  const jacket = type === 'jacket';
  const sweatshirt = type === 'sweatshirt';
  const polo = type === 'polo';
  const longSleeve = jacket || sweatshirt || hoodie;

  const sleeveLength = longSleeve ? 1.2 : 0.85;
  const sleeveWidth = hoodie ? 0.48 : 0.42;

  return (
    <group>
      <ShirtBody
        color={color}
        oversized={oversized}
        jacket={jacket}
      />

      <Sleeve
        side="left"
        color={color}
        length={sleeveLength}
        width={sleeveWidth}
      />

      <Sleeve
        side="right"
        color={color}
        length={sleeveLength}
        width={sleeveWidth}
      />

      {hoodie && <HoodieDetails color={color} />}

      {polo && <PoloDetails color={color} />}

      {sweatshirt && (
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[1.48, 0.12, 0.5]} />
          <GarmentMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}

function Pants({ color }) {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.88, 0.43, 0.44]} />
        <GarmentMaterial color={color} />
      </mesh>

      {[-0.25, 0.25].map((x, index) => (
        <group key={index} position={[x, -0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.39, 1.35, 0.43]} />
            <GarmentMaterial color={color} />
          </mesh>

          <mesh position={[0, -0.66, 0]}>
            <boxGeometry args={[0.4, 0.07, 0.44]} />
            <GarmentMaterial color={color} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.46]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
    </group>
  );
}

function Tracksuit({ color }) {
  return (
    <group>
      <group position={[0, 0.85, 0]}>
        <TopGarment type="sweatshirt" color={color} />
      </group>

      <group position={[0, -0.95, 0]}>
        <Pants color={color} />
      </group>
    </group>
  );
}

function Shape({ type, color }) {
  if (type === 'pants') {
    return <Pants color={color} />;
  }

  if (type === 'tracksuit') {
    return <Tracksuit color={color} />;
  }

  return <TopGarment type={type} color={color} />;
}

export default function GarmentPreview({ type, color }) {
  const background = useMemo(() => {
    return new THREE.Color('#e9e5dd');
  }, []);

  return (
    <div className="preview3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 4.5],
          fov: 42
        }}
        gl={{
          antialias: true,
          alpha: true
        }}
      >
        <color attach="background" args={[background]} />

        <ambientLight intensity={0.75} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <directionalLight
          position={[-4, 2, -3]}
          intensity={0.7}
        />

        <Environment preset="studio" />

        <group position={[0, 0, 0]}>
          <Shape type={type} color={color} />
        </group>

        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.32}
          blur={2.5}
          scale={4}
        />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={7}
          minPolarAngle={0.5}
          maxPolarAngle={2.4}
          autoRotate={false}
        />
      </Canvas>

      <span className="rotate-hint">
        Drag to rotate · Scroll to zoom
      </span>
    </div>
  );
}
