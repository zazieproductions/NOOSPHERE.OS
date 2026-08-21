export interface NoteItem {
  id: string;
  title: string;
  body: string;
  tags: string[];
  hex: string;
  createdAt: number;
  pinned: boolean;
  origin: 'seed' | 'synth' | 'palette';
}

export type AppId =
  | 'mindmap'
  | 'notes'
  | 'synth'
  | 'vision'
  | 'colorforge'
  | 'terminal'
  | 'about';

export interface WindowState {
  id: string;
  appId: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
}

export interface MindNode {
  id: string;
  label: string;
  x: number;
  y: number;
  hex: string;
  kind: 'core' | 'cluster' | 'leaf';
}

export interface MindEdge {
  id: string;
  a: string;
  b: string;
}
