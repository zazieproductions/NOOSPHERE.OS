import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link2, Palette, Pencil, Plus, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import type { MindEdge, MindNode } from '../../types';
import { buildInitialGraph, randomConceptLabel, WORLD_SIZE } from '../../data/mindmapData';
import { clamp, randomHueHex, uid } from '../../lib/random';

const MindMapApp: React.FC = () => {
  const [{ nodes, edges }, setGraph] = useState(() => buildInitialGraph());
  const [view, setView] = useState({ x: -600, y: -520, scale: 0.62 });
  const [selected, setSelected] = useState<string | null>(null);
  const [linkFrom, setLinkFrom] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const dragState = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);

  const setNodes = (updater: (n: MindNode[]) => MindNode[]) =>
    setGraph((g) => ({ ...g, nodes: updater(g.nodes) }));
  const setEdges = (updater: (e: MindEdge[]) => MindEdge[]) =>
    setGraph((g) => ({ ...g, edges: updater(g.edges) }));

  const onCanvasDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).dataset.canvasBg !== 'true') return;
    panState.current = { startX: e.clientX, startY: e.clientY, origX: view.x, origY: view.y };
    window.addEventListener('mousemove', onPanMove);
    window.addEventListener('mouseup', onPanUp);
  };
  const onPanMove = (e: MouseEvent) => {
    if (!panState.current) return;
    setView((v) => ({ ...v, x: panState.current!.origX + (e.clientX - panState.current!.startX), y: panState.current!.origY + (e.clientY - panState.current!.startY) }));
  };
  const onPanUp = () => {
    panState.current = null;
    window.removeEventListener('mousemove', onPanMove);
    window.removeEventListener('mouseup', onPanUp);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setView((v) => ({ ...v, scale: clamp(v.scale * (e.deltaY < 0 ? 1.08 : 0.92), 0.25, 2.2) }));
  };

  const onNodeDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id)!;
    dragState.current = { id, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y, moved: false };
    window.addEventListener('mousemove', onNodeMove);
    window.addEventListener('mouseup', onNodeUp);
  };
  const onNodeMove = (e: MouseEvent) => {
    if (!dragState.current) return;
    const dx = (e.clientX - dragState.current.startX) / view.scale;
    const dy = (e.clientY - dragState.current.startY) / view.scale;
    if (Math.abs(dx) + Math.abs(dy) > 2) dragState.current.moved = true;
    const nx = dragState.current.origX + dx;
    const ny = dragState.current.origY + dy;
    setNodes((ns) => ns.map((n) => (n.id === dragState.current!.id ? { ...n, x: nx, y: ny } : n)));
  };
  const onNodeUp = () => {
    const ds = dragState.current;
    dragState.current = null;
    window.removeEventListener('mousemove', onNodeMove);
    window.removeEventListener('mouseup', onNodeUp);
    if (ds && !ds.moved) handleNodeClick(ds.id);
  };

  const handleNodeClick = (id: string) => {
    if (linkFrom) {
      if (linkFrom !== id) {
        setEdges((es) => {
          const exists = es.some((e) => (e.a === linkFrom && e.b === id) || (e.a === id && e.b === linkFrom));
          return exists ? es : [...es, { id: uid(), a: linkFrom, b: id }];
        });
      }
      setLinkFrom(null);
      return;
    }
    setSelected((s) => (s === id ? null : id));
  };

  const worldToScreenRect = useCallback(() => containerRef.current?.getBoundingClientRect(), []);

  const onCanvasDoubleClick = (e: React.MouseEvent) => {
    const rect = worldToScreenRect();
    if (!rect) return;
    const wx = (e.clientX - rect.left - view.x) / view.scale;
    const wy = (e.clientY - rect.top - view.y) / view.scale;
    const newNode: MindNode = { id: uid(), label: randomConceptLabel(), x: wx, y: wy, hex: randomHueHex(), kind: 'leaf' };
    setNodes((ns) => [...ns, newNode]);
    if (selected) {
      setEdges((es) => [...es, { id: uid(), a: selected, b: newNode.id }]);
    }
    setSelected(newNode.id);
  };

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected));
    setEdges((es) => es.filter((e) => e.a !== selected && e.b !== selected));
    setSelected(null);
  };

  const renameSelected = () => {
    if (!selected) return;
    const node = nodes.find((n) => n.id === selected);
    const name = prompt('Rename concept node:', node?.label ?? '');
    if (name && name.trim()) setNodes((ns) => ns.map((n) => (n.id === selected ? { ...n, label: name.trim() } : n)));
  };

  const recolorSelected = () => {
    if (!selected) return;
    const hex = randomHueHex();
    setNodes((ns) => ns.map((n) => (n.id === selected ? { ...n, hex } : n)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLinkFrom(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const nodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="w-full h-full flex flex-col bg-[#07080d]">
      <div className="relative h-10 shrink-0 overflow-hidden border-b border-white/10">
        <img src="/img/synapse-banner.png" alt="" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080d] via-transparent to-[#07080d]" />
        <span className="absolute inset-0 flex items-center px-3 text-[10px] tracking-[0.3em] text-cyan-200 font-bold">SYNAPSE GRID</span>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 text-[11px] font-mono text-slate-300 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setView((v) => ({ ...v, scale: clamp(v.scale * 1.15, 0.25, 2.2) }))} className="toolbtn"><ZoomIn size={12} /></button>
          <button onClick={() => setView((v) => ({ ...v, scale: clamp(v.scale * 0.87, 0.25, 2.2) }))} className="toolbtn"><ZoomOut size={12} /></button>
          <span className="text-slate-500">double-click canvas: new node &middot; drag: move &middot; scroll: zoom</span>
        </div>
        {selected && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setLinkFrom(selected)} className={`toolbtn ${linkFrom === selected ? 'ring-1 ring-cyan-300' : ''}`}><Link2 size={12} /> Link</button>
            <button onClick={renameSelected} className="toolbtn"><Pencil size={12} /> Rename</button>
            <button onClick={recolorSelected} className="toolbtn"><Palette size={12} /> Recolor</button>
            <button onClick={deleteSelected} className="toolbtn hover:!bg-red-500/20 hover:!border-red-400/50"><Trash2 size={12} /> Delete</button>
          </div>
        )}
        {!selected && (
          <button
            onClick={() => {
              const rect = worldToScreenRect();
              const wx = rect ? (rect.width / 2 - view.x) / view.scale : WORLD_SIZE / 2;
              const wy = rect ? (rect.height / 2 - view.y) / view.scale : WORLD_SIZE / 2;
              setNodes((ns) => [...ns, { id: uid(), label: randomConceptLabel(), x: wx, y: wy, hex: randomHueHex(), kind: 'leaf' }]);
            }}
            className="toolbtn"
          >
            <Plus size={12} /> Add Node
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          backgroundColor: '#07080d',
        }}
        data-canvas-bg="true"
        onMouseDown={onCanvasDown}
        onWheel={onWheel}
        onDoubleClick={onCanvasDoubleClick}
      >
        <div
          data-canvas-bg="true"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: '0 0', width: WORLD_SIZE, height: WORLD_SIZE, position: 'absolute' }}
        >
          <svg width={WORLD_SIZE} height={WORLD_SIZE} className="absolute top-0 left-0 pointer-events-none" data-canvas-bg="true">
            {edges.map((e) => {
              const a = nodeById(e.a);
              const b = nodeById(e.b);
              if (!a || !b) return null;
              return <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,255,242,0.28)" strokeWidth={1.5} />;
            })}
          </svg>

          {nodes.map((n) => {
            const isCore = n.kind === 'core';
            const isSel = selected === n.id;
            const isLinkSrc = linkFrom === n.id;
            return (
              <div
                key={n.id}
                onMouseDown={(e) => onNodeDown(e, n.id)}
                className="absolute flex items-center justify-center text-center font-mono px-3 py-2 rounded-full select-none cursor-pointer transition-shadow"
                style={{
                  left: n.x,
                  top: n.y,
                  transform: 'translate(-50%, -50%)',
                  minWidth: isCore ? 150 : 110,
                  maxWidth: isCore ? 190 : 150,
                  fontSize: isCore ? 12 : 10.5,
                  fontWeight: isCore ? 700 : 500,
                  color: '#050608',
                  background: n.hex,
                  boxShadow: isSel || isLinkSrc ? `0 0 0 3px #fff, 0 0 22px ${n.hex}` : `0 0 14px ${n.hex}88`,
                  zIndex: isCore ? 5 : 3,
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                }}
              >
                {n.label.toUpperCase()}
              </div>
            );
          })}
        </div>

        {linkFrom && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 px-2 py-1 rounded">
            select a node to link &mdash; esc to cancel
          </div>
        )}
      </div>

      <style>{`
        .toolbtn { display:inline-flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.03); color:#cbd5e1; }
        .toolbtn:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
};

export default MindMapApp;
