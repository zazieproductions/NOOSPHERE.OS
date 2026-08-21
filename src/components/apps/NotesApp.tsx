import React, { useMemo, useState } from 'react';
import { Pin, PinOff, Search, Trash2, X } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { TAGS } from '../../data/wordbanks';
import type { NoteItem } from '../../types';

type SortMode = 'newest' | 'oldest' | 'pinned';

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

const NotesApp: React.FC = () => {
  const { notes, removeNote, togglePin } = useNotes();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>('newest');
  const [openNote, setOpenNote] = useState<NoteItem | null>(null);

  const filtered = useMemo(() => {
    let list = notes;
    if (tag) list = list.filter((n) => n.tags.includes(tag));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q)));
    }
    const arr = [...list];
    if (sort === 'newest') arr.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === 'oldest') arr.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === 'pinned') arr.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt - a.createdAt);
    return arr;
  }, [notes, tag, query, sort]);

  return (
    <div className="w-full h-full flex text-slate-200 font-mono text-[12px] bg-[#07080d]">
      <div className="w-44 shrink-0 border-r border-white/10 p-2.5 flex flex-col gap-3 overflow-y-auto">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search archive..."
            className="w-full bg-white/5 border border-white/10 rounded pl-6 pr-2 py-1.5 text-[11px] outline-none focus:border-amber-400/60"
          />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 mb-1 tracking-wider">SORT</div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="w-full bg-white/5 border border-white/10 rounded px-1.5 py-1 text-[11px] outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="pinned">Pinned first</option>
          </select>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 mb-1 tracking-wider">TAGS</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setTag(null)}
              className={`px-1.5 py-0.5 rounded border text-[10px] ${tag === null ? 'border-amber-400 text-amber-300 bg-amber-400/10' : 'border-white/10 text-slate-400'}`}
            >
              all
            </button>
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? null : t)}
                className={`px-1.5 py-0.5 rounded border text-[10px] ${tag === t ? 'border-amber-400 text-amber-300 bg-amber-400/10' : 'border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto text-[10px] text-slate-500 pt-2 border-t border-white/10">
          {notes.length} notes archived
          <br />
          {filtered.length} shown
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto p-3 relative">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 [column-fill:_balance]">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => setOpenNote(n)}
              className="mb-3 w-full text-left break-inside-avoid block rounded-md p-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/10"
              style={{ borderLeft: `3px solid ${n.hex}` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-[12px] font-semibold text-slate-100">{n.title}</div>
                {n.pinned && <Pin size={11} className="text-amber-400 shrink-0 mt-0.5" />}
              </div>
              <div className="text-[10.5px] text-slate-400 mt-1 line-clamp-3">{n.body}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-wrap gap-1">
                  {n.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[9px] text-slate-500">{t}</span>
                  ))}
                </div>
                <span className="text-[9px] font-bold" style={{ color: n.hex }}>{n.hex}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-slate-500 text-center mt-10 col-span-full">no fragments match that query.</div>
          )}
        </div>
      </div>

      {openNote && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-20">
          <div className="w-full max-w-md rounded-lg border border-white/15 bg-[#0b0d13] p-4 relative" style={{ boxShadow: `0 0 40px -10px ${openNote.hex}66` }}>
            <button onClick={() => setOpenNote(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white">
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ background: openNote.hex }} />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: openNote.hex }}>{openNote.hex}</span>
            </div>
            <h3 className="text-slate-100 font-semibold text-[15px] mb-2">{openNote.title}</h3>
            <p className="text-slate-300 text-[12.5px] leading-relaxed mb-3">{openNote.body}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {openNote.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/10">
              <span>{formatDate(openNote.createdAt)} &middot; {openNote.origin}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePin(openNote.id)} className="flex items-center gap-1 hover:text-amber-300">
                  {openNote.pinned ? <PinOff size={12} /> : <Pin size={12} />} {openNote.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={() => { removeNote(openNote.id); setOpenNote(null); }}
                  className="flex items-center gap-1 hover:text-red-400"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesApp;
