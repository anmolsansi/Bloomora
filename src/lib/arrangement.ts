interface FlowerPlacement {
  flowerId: string;
  count: number;
  color: string;
}

interface Position {
  flowerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  layer: number;
}

const shapeConfig: Record<
  string,
  { maxRadiusX: number; maxRadiusY: number; yBias: number }
> = {
  round: { maxRadiusX: 120, maxRadiusY: 120, yBias: 0 },
  cascading: { maxRadiusX: 100, maxRadiusY: 150, yBias: 30 },
  hand_tied: { maxRadiusX: 90, maxRadiusY: 130, yBias: 10 },
  presentation: { maxRadiusX: 140, maxRadiusY: 100, yBias: -20 },
};

export function generatePositions(
  selectedFlowers: FlowerPlacement[],
  shape: string,
  fullness: number
): Position[] {
  const positions: Position[] = [];
  const centerX = 200;
  const centerY = 200;
  const config = shapeConfig[shape] || shapeConfig.round;
  const radiusMultiplier = 0.5 + fullness * 0.5;

  selectedFlowers.forEach((flower) => {
    for (let i = 0; i < flower.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = Math.random() * config.maxRadiusX * radiusMultiplier;
      const radiusY = Math.random() * config.maxRadiusY * radiusMultiplier;
      const x = centerX + Math.cos(angle) * radiusX - 40;
      const y = centerY + Math.sin(angle) * radiusY + config.yBias - 40;
      const scale = 0.6 + fullness * 0.3 + Math.random() * 0.3;
      const rotation = -15 + Math.random() * 30;
      const layer = Math.floor(Math.random() * 3) + 2;

      positions.push({
        flowerId: flower.flowerId,
        x,
        y,
        scale,
        rotation,
        layer,
      });
    }
  });

  return positions.sort((a, b) => a.layer - b.layer);
}
