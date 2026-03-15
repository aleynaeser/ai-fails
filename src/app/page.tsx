'use client';

import { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { mockFails } from '@constants/mock-data';
import { useThree, useFrame } from '@react-three/fiber';
import { InfiniteGrid } from '@ui/GridView/InfiniteGrid';
import { DistortionShader } from '@ui/GridView/DistortionShader';
import { EffectComposer, RenderPass, ShaderPass } from 'three-stdlib';

const SceneEffects = () => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const comp = new EffectComposer(gl);
    comp.addPass(new RenderPass(scene, camera));
    const distPass = new ShaderPass(DistortionShader);
    // Başlangıç bükülme değeri (0.1 civarı idealdir)
    distPass.uniforms.distortion.value.set(0.1, 0.1);
    comp.addPass(distPass);
    return comp;
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useFrame(() => composer.render(), 1);
  return null;
};

export default function Home() {
  return (
    <div className='bg-background h-screen w-full cursor-grab active:cursor-grabbing'>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach='background' args={['#000']} />
        <InfiniteGrid data={mockFails} />
      </Canvas>
    </div>
  );
}
