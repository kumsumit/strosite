import { Canvas } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei/core/RoundedBox.js';
// On-demand rendering: no continuous animation loop, downloaded models or textures.
export default function DashboardDepth() {
  return <div className="preview-depth" aria-hidden="true"><Canvas frameloop="demand" dpr={[1, 1.25]} camera={{ position: [0, 0, 7], fov: 38 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
    <ambientLight intensity={1.5} /><directionalLight position={[3, 4, 5]} intensity={2} />
    <group rotation={[-.08, -.12, -.035]}><RoundedBox args={[5.65, 4.6, .16]} radius={.08}><meshStandardMaterial color="#c3d8c7" roughness={.8} /></RoundedBox><RoundedBox position={[.18, -.15, -.2]} args={[5.65, 4.6, .12]} radius={.08}><meshStandardMaterial color="#e3ebe0" roughness={1} /></RoundedBox></group>
  </Canvas></div>;
}
