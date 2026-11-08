import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function Shape({type,color}) {
  const common={color,roughness:.72,metalness:.02};
  if(type==='pants') return <group position={[0,-.15,0]}>
    <mesh position={[-.25,-.35,0]} castShadow><boxGeometry args={[.38,1.35,.42]}/><meshStandardMaterial {...common}/></mesh>
    <mesh position={[.25,-.35,0]} castShadow><boxGeometry args={[.38,1.35,.42]}/><meshStandardMaterial {...common}/></mesh>
    <mesh position={[0,.42,0]} castShadow><boxGeometry args={[.85,.48,.43]}/><meshStandardMaterial {...common}/></mesh>
  </group>;
  return <group>
    <mesh position={[0,.12,0]} castShadow><boxGeometry args={[type==='oversized'?1.8:1.45,1.35,.48]}/><meshStandardMaterial {...common}/></mesh>
    <mesh position={[-.98,.12,0]} rotation={[0,0,-.15]} castShadow><boxGeometry args={[.48,1.15,.45]}/><meshStandardMaterial {...common}/></mesh>
    <mesh position={[.98,.12,0]} rotation={[0,0,.15]} castShadow><boxGeometry args={[.48,1.15,.45]}/><meshStandardMaterial {...common}/></mesh>
    {type==='hoodie' && <mesh position={[0,.92,0]} castShadow><torusGeometry args={[.28,.12,12,24]}/><meshStandardMaterial {...common}/></mesh>}
  </group>;
}
export default function GarmentPreview({type,color}) {
 return <div className="preview3d"><Canvas camera={{position:[0,0,4.2],fov:42}} shadows>
   <ambientLight intensity={1.1}/><directionalLight position={[3,4,5]} intensity={2} castShadow/>
   <Environment preset="studio"/><Shape type={type} color={color}/><ContactShadows position={[0,-1.25,0]} opacity={.3} blur={2}/>
   <OrbitControls enablePan={false} minDistance={3} maxDistance={6}/>
 </Canvas><span className="rotate-hint">Drag to rotate · scroll to zoom</span></div>;
}