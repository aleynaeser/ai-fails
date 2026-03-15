'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuoteTile } from './GridTile';

const COLS = 5;
const ROWS = 8;
const TILE_W = 4;
const TILE_H = 3;
const BOUNDARY_X = COLS * TILE_W * 0.6;
const BOUNDARY_Y = ROWS * TILE_H * 0.6;

// Piksel hareketini 3D birimine çevirme (sürüklemeyi hissedilir yapar)
const DRAG_SCALE = 0.012;

export const InfiniteGrid = ({ data }: { data: IFailItem[] }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const basePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < Math.min(data.length, COLS * ROWS); i++) {
      positions.push([
        (i % COLS) * TILE_W - (COLS * TILE_W) / 2 + TILE_W / 2,
        Math.floor(i / COLS) * TILE_H - (ROWS * TILE_H) / 2 + TILE_H / 2,
        0,
      ]);
    }
    return positions;
  }, [data.length]);

  useFrame(() => {
    const offset = dragOffset.current;
    const children = groupRef.current.children;

    children.forEach((child, i) => {
      if (i >= basePositions.length) return;
      const [bx, by] = basePositions[i];
      let x = bx + offset.x;
      let y = by + offset.y;

      // Sonsuz döngü: sınırı aşan kartları diğer tarafa ışınla
      while (x < -BOUNDARY_X) x += BOUNDARY_X * 2;
      while (x > BOUNDARY_X) x -= BOUNDARY_X * 2;
      while (y < -BOUNDARY_Y) y += BOUNDARY_Y * 2;
      while (y > BOUNDARY_Y) y -= BOUNDARY_Y * 2;

      child.position.set(x, y, 0);
    });
  });

  const onPointerDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'grabbing';
  };

  const onPointerMove = (e: { movementX: number; movementY: number; buttons: number }) => {
    if (e.buttons !== 1) return;
    dragOffset.current.x += e.movementX * DRAG_SCALE;
    dragOffset.current.y -= e.movementY * DRAG_SCALE;
  };

  const releaseCursor = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
  };

  const onPointerUp = releaseCursor;
  const onPointerLeave = releaseCursor;

  return (
    <>
      {/* Tüm alanda sürükleme için görünmez düzlem (grid'den önce çarpar) */}
      <mesh
        position={[0, 0, 0.5]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerCancel={releaseCursor}
      >
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]}>
        {data.slice(0, COLS * ROWS).map((item, i) => (
          <QuoteTile
            key={item.id}
            position={basePositions[i] ?? [0, 0, 0]}
            item={item}
          />
        ))}
      </group>
    </>
  );
};
