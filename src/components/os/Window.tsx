import React, { useRef } from 'react';
import { Minus, X } from 'lucide-react';
import type { WindowState } from '../../types';
import { APP_REGISTRY } from '../../context/OSContext';

interface Props {
  win: WindowState;
  focused: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  children: React.ReactNode;
}

const MIN_W = 340;
const MIN_H = 260;

const Window: React.FC<Props> = ({ win, focused, onClose, onFocus, onMinimize, onMove, onResize, children }) => {
  const meta = APP_REGISTRY[win.appId];
  const Icon = meta.icon;
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeState = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const handleTitleDown = (e: React.MouseEvent) => {
    onFocus();
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y };
    window.addEventListener('mousemove', handleTitleMove);
    window.addEventListener('mouseup', handleTitleUp);
  };

  const handleTitleMove = (e: MouseEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    onMove(Math.max(4, dragState.current.origX + dx), Math.max(4, dragState.current.origY + dy));
  };

  const handleTitleUp = () => {
    dragState.current = null;
    window.removeEventListener('mousemove', handleTitleMove);
    window.removeEventListener('mouseup', handleTitleUp);
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    resizeState.current = { startX: e.clientX, startY: e.clientY, origW: win.w, origH: win.h };
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeUp);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeState.current) return;
    const dw = e.clientX - resizeState.current.startX;
    const dh = e.clientY - resizeState.current.startY;
    onResize(Math.max(MIN_W, resizeState.current.origW + dw), Math.max(MIN_H, resizeState.current.origH + dh));
  };

  const handleResizeUp = () => {
    resizeState.current = null;
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeUp);
  };

  if (win.minimized) return null;

  return (
    <div
      className="absolute rounded-lg overflow-hidden flex flex-col shadow-2xl"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        border: `1px solid ${focused ? meta.accent : '#2a2f3a'}`,
        boxShadow: focused ? `0 0 0 1px ${meta.accent}33, 0 20px 60px -20px ${meta.accent}55, 0 0 40px -10px ${meta.accent}33` : '0 10px 40px -20px rgba(0,0,0,0.8)',
        background: 'rgba(9,11,16,0.88)',
        backdropFilter: 'blur(14px)',
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none shrink-0"
        style={{ background: `linear-gradient(90deg, ${meta.accent}22, transparent 70%)`, borderBottom: `1px solid ${focused ? meta.accent + '55' : '#20242e'}` }}
        onMouseDown={handleTitleDown}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={14} className="shrink-0" style={{ color: meta.accent }} />
          <span className="text-[11px] font-mono tracking-wider truncate" style={{ color: meta.accent }}>
            {meta.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="w-5 h-5 rounded-sm flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="w-5 h-5 rounded-sm flex items-center justify-center hover:bg-red-500/80 text-slate-400 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden relative">{children}</div>
      <div
        onMouseDown={handleResizeDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${meta.accent}66 50%)`,
        }}
      />
    </div>
  );
};

export default Window;
