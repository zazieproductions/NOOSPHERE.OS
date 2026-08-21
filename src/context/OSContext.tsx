import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { AppId, WindowState } from '../types';
import {
  GitBranch, StickyNote, Sparkles, Waves, Palette, SquareTerminal, UserCircle2,
} from 'lucide-react';

export interface AppMeta {
  id: AppId;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  w: number;
  h: number;
  accent: string;
}

export const APP_REGISTRY: Record<AppId, AppMeta> = {
  mindmap: { id: 'mindmap', title: 'MindMap // Synapse Grid', icon: GitBranch, w: 860, h: 560, accent: '#00FFF2' },
  notes: { id: 'notes', title: 'Notes // The Archive', icon: StickyNote, w: 760, h: 560, accent: '#FFB000' },
  synth: { id: 'synth', title: 'Idea Synthesizer', icon: Sparkles, w: 560, h: 560, accent: '#FF2BD6' },
  vision: { id: 'vision', title: 'Vision Simulator', icon: Waves, w: 680, h: 520, accent: '#7CFF00' },
  colorforge: { id: 'colorforge', title: 'ColorForge // Hex Lab', icon: Palette, w: 560, h: 520, accent: '#7C3AED' },
  terminal: { id: 'terminal', title: 'Terminal // root@noosphere', icon: SquareTerminal, w: 620, h: 420, accent: '#3DFFC0' },
  about: { id: 'about', title: 'About // Dossier', icon: UserCircle2, w: 520, h: 560, accent: '#FF5252' },
};

interface OSContextValue {
  windows: WindowState[];
  openApp: (id: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number) => void;
  isOpen: (id: AppId) => boolean;
}

const OSContext = createContext<OSContextValue | null>(null);

let winSeq = 0;

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zRef = useRef(10);
  const offsetRef = useRef(0);

  const focusWindow = useCallback((id: string) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  }, []);

  const openApp = useCallback((id: AppId) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === id);
      if (existing) {
        zRef.current += 1;
        return prev.map((w) => (w.id === existing.id ? { ...w, minimized: false, z: zRef.current } : w));
      }
      const meta = APP_REGISTRY[id];
      offsetRef.current += 1;
      const offset = (offsetRef.current % 6) * 26;
      zRef.current += 1;
      winSeq += 1;
      const win: WindowState = {
        id: `win-${winSeq}`,
        appId: id,
        x: 80 + offset + (typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - meta.w) / 2 - 260) : 0),
        y: 70 + offset,
        w: meta.w,
        h: meta.h,
        z: zRef.current,
        minimized: false,
      };
      return [...prev, win];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: string, w: number, h: number) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  const isOpen = useCallback((id: AppId) => windows.some((w) => w.appId === id && !w.minimized), [windows]);

  const value = useMemo(
    () => ({ windows, openApp, closeWindow, focusWindow, minimizeWindow, moveWindow, resizeWindow, isOpen }),
    [windows, openApp, closeWindow, focusWindow, minimizeWindow, moveWindow, resizeWindow, isOpen]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
}
