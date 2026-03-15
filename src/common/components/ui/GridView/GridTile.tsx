'use client';

import { Text, Line } from '@react-three/drei';

// InfiniteGrid ile aynı birimler – boşluk kalmaması için tam oturur
const TILE_W = 4;
const TILE_H = 3;

export const QuoteTile = ({ item, position }: { item: IFailItem; position: [number, number, number] }) => {
  const w = TILE_W;
  const h = TILE_H;

  // Hücre sınırları – çizgiler belirgin
  const points: [number, number, number][] = [
    [-w / 2, h / 2, 0],
    [w / 2, h / 2, 0],
    [w / 2, -h / 2, 0],
    [-w / 2, -h / 2, 0],
    [-w / 2, h / 2, 0],
  ];

  return (
    <group position={position}>
      <Line points={points} color='#fff' lineWidth={1.5} />

      {/* Başlık */}
      <Text fontSize={0.14} color='white' position={[-w / 2 + 0.15, h / 2 - 0.25, 0]} anchorX='left'>
        {item.author.toUpperCase()}
      </Text>

      {/* İçerik */}
      <Text fontSize={0.11} color='#888' position={[0, 0, 0]} maxWidth={w - 0.4} textAlign='center'>
        {item.title}
      </Text>
    </group>
  );
};
