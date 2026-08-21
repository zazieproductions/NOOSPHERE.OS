import React from 'react';
import { useOS, APP_REGISTRY } from '../../context/OSContext';
import type { AppId } from '../../types';

const ORDER: AppId[] = ['mindmap', 'notes', 'synth', 'vision', 'colorforge', 'terminal', 'about'];

const Dock: React.FC = () => {
  const { openApp, isOpen } = useOS();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9000]">
      <div className="flex items-end gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
        {ORDER.map((id) => {
          const meta = APP_REGISTRY[id];
          const Icon = meta.icon;
          const active = isOpen(id);
          return (
            <button
              key={id}
              onClick={() => openApp(id)}
              title={meta.title}
              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:-translate-y-1.5 hover:scale-105"
              style={{
                background: active ? `${meta.accent}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? meta.accent + '77' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <Icon size={19} style={{ color: meta.accent }} />
              <span
                className={`absolute -bottom-1 w-1 h-1 rounded-full transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: meta.accent }}
              />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono px-2 py-1 rounded bg-black/90 border border-white/10 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {meta.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
