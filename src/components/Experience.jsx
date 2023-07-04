import { Environment, MeshPortalMaterial, OrbitControls, RoundedBox, useTexture, Text, CameraControls, useCursor } from "@react-three/drei";
import { Alien } from "./Alien";
import { Ninja } from "./Ninja";
import { BlueDemon } from "./BlueDemon";
import * as THREE from 'three';
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHover] = useState(null);
  useCursor(hovered)
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() =>{
    if (active) {
      const targetPosition = new THREE.Vector3();   
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0, 0, 5, targetPosition.x, targetPosition.y, targetPosition.z, true
      )
    } else {
      controlsRef.current.setLookAt(
        0, 0, 10, 0, 0, 0, true
      )
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5}/>
      <Environment preset="sunset" />
      <CameraControls ref={controlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
      <MonsterStage texture={'textures/fantasy_alien_world.jpg'} name={'Alien'} color={'#b5375f'} active={active} setActive={setActive} hovered={hovered} setHover={setHover}>
        <Alien scale={0.6} position-y={-1} hovered={hovered === "Alien"} />
      </MonsterStage>
      <MonsterStage texture={'textures/scifi_chinese_town_night.jpg'} name={'Ninja'} color={'#879ab7'} active={active} setActive={setActive} hovered={hovered} setHover={setHover} position-x={-2.5}  rotation-y={Math.PI / 8} >
        <Ninja scale={0.5} position-y={-1} hovered={hovered === "Ninja"} />
      </MonsterStage>
      <MonsterStage texture={'textures/scifi_neon_city.jpg'} name={'Blue Demon'} color={'#4586a9'} active={active} setActive={setActive} hovered={hovered} setHover={setHover} position-x={2.5} rotation-y={-Math.PI / 8}>
        <BlueDemon scale={0.5} position-y={-1} hovered={hovered === "BlueDemon"} />
      </MonsterStage>
    </>
  );
};


const MonsterStage = ({children, texture, name, color, active, setActive, hovered, setHover, ...props}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  })

  return <group {...props} >
  <Text font="fonts/Caprasimo-Regular.ttf" fontSize={0.3} position={[0, -1.3, 0.051]} anchorY={'bottom'}>
    {name}
    <meshBasicMaterial color={color} toneMapped={false}/>
  </Text>
    <RoundedBox name={name} args={[2, 3, 0.1]} onDoubleClick={() => setActive(active === name ? null : name)} onPointerEnter={() => setHover(name)} onPointerLeave={() => setHover(null)}> 
        {/* <planeGeometry args={[2,3]} /> */}
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <ambientLight intensity={1}/>
          <Environment preset="sunset" />  
          {children}
            <mesh>
              <sphereGeometry args={[5, 64, 64]} />
              <meshStandardMaterial map={map} side={THREE.BackSide}/>
            </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
  </group>
}
