import type { MindNode, MindEdge } from '../types';
import { choice, randomHueHex, uid, rand } from '../lib/random';
import { ADJECTIVES, FIELDS, NOUNS } from './wordbanks';

export const WORLD_SIZE = 2600;
const CENTER = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };

export function randomConceptLabel(): string {
  return `${choice(ADJECTIVES)} ${choice(FIELDS.concat(NOUNS))}`;
}

export function buildInitialGraph(): { nodes: MindNode[]; edges: MindEdge[] } {
  const nodes: MindNode[] = [];
  const edges: MindEdge[] = [];

  const core: MindNode = {
    id: uid(),
    label: 'GENIUS ENGINE',
    x: CENTER.x,
    y: CENTER.y,
    hex: '#00FFF2',
    kind: 'core',
  };
  nodes.push(core);

  const clusterCount = 8;
  for (let i = 0; i < clusterCount; i++) {
    const angle = (i / clusterCount) * Math.PI * 2;
    const radius = 300;
    const cluster: MindNode = {
      id: uid(),
      label: `${choice(ADJECTIVES)} ${choice(FIELDS)}`,
      x: CENTER.x + Math.cos(angle) * radius,
      y: CENTER.y + Math.sin(angle) * radius,
      hex: randomHueHex(),
      kind: 'cluster',
    };
    nodes.push(cluster);
    edges.push({ id: uid(), a: core.id, b: cluster.id });

    const leafCount = 2;
    for (let j = 0; j < leafCount; j++) {
      const leafAngle = angle + rand(-0.5, 0.5);
      const leafRadius = radius + 220 + j * 40;
      const leaf: MindNode = {
        id: uid(),
        label: `${choice(ADJECTIVES)} ${choice(NOUNS)}`,
        x: CENTER.x + Math.cos(leafAngle) * leafRadius,
        y: CENTER.y + Math.sin(leafAngle) * leafRadius,
        hex: cluster.hex,
        kind: 'leaf',
      };
      nodes.push(leaf);
      edges.push({ id: uid(), a: cluster.id, b: leaf.id });
    }
  }

  return { nodes, edges };
}
