import React, { useState } from 'react';
import { Check, Copy, RefreshCw, Save } from 'lucide-react';
import { hexFromHue, randInt } from '../../lib/random';
import { useNotes } from '../../context/NotesContext';

type Mode = 'analogous' | 'complementary' | 'triadic' | 'random';

const MOOD_WORDS = ['Feral', 'Serene', 'Voltaic', 'Melancholic', 'Baroque', 'Lucid', 'Molten', 'Glacial', 'Sacred', 'Static'];

function generatePalette(mode: Mode): string[] {
  const base = randInt(0, 359);
  if (mode === 'random') return Array.from({ length: 5 }, () => hexFromHue(randInt(0, 359), randInt(50, 90), randInt(35, 70)));
  if (mode === 'complementary') {
    return [base, base + 12, base + 180, base + 192, base + 6].map((h, i) => hexFromHue(h, 70 + i, 40 + i * 6));
  }
  if (mode === 'triadic') {
    return [base, base + 120, base + 120, base + 240, base + 240].map((h, i) => hexFromHue(h, 68, 42 + i * 6));
  }
  // analogous
  return [base - 30, base - 15, base, base + 15, base + 30].map((h, i) => hexFromHue(h, 65 + i, 45 + i * 4));
}

function moodFor(hex: string): string {
  const idx = hex.charCodeAt(1) % MOOD_WORDS.length;
  return MOOD_WORDS[idx];
}

const ColorForgeApp: React.FC = () => {
  const { addNote } = useNotes();
  const [mode, setMode] = useState<Mode>('analogous');
  const [palette, setPalette] = useState<string[]>(() => generatePalette('analogous'));
  const [history, setHistory] = useState<string[][]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const regenerate = (m: Mode = mode) => {
    setHistory((h) => [palette, ...h].slice(0, 6));
    setPalette(generatePalette(m));
  };

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1000);
  };

  const saveAsNote = () => {
    addNote({
      title: `${moodFor(palette[2])} Palette`,
      body: `A curated ${mode} spectrum forged for visionary use: ${palette.join(', ')}.`,
      hex: palette[2],
      tags: ['#color-theory', '#branding'],
      origin: 'palette',
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07080d] text-slate-200 font-mono text-[12px]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 flex-wrap">
        {(['analogous', 'complementary', 'triadic', 'random'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); regenerate(m); }}
            className={`px-2 py-1 rounded text-[10px] border ${mode === m ? 'border-violet-400 text-violet-300 bg-violet-400/10' : 'border-white/10 text-slate-400 hover:border-white/30'}`}
          >
            {m}
          </button>
        ))}
        <button onClick={() => regenerate()} className="ml-auto flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-violet-400/60 text-[10px]">
          <RefreshCw size={11} /> Regenerate
        </button>
      </div>

      <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto">
        <div className="flex-1 flex gap-2 min-h-[160px]">
          {palette.map((hex) => (
            <button
              key={hex}
              onClick={() => copy(hex)}
              className="flex-1 rounded-lg relative flex items-end justify-center pb-3 transition-transform hover:scale-[1.03] group"
              style={{ background: hex, boxShadow: `0 10px 30px -10px ${hex}88` }}
            >
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/50 text-white backdrop-blur flex items-center gap-1">
                {copied === hex ? <Check size={11} /> : <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                {hex}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>mood: <span className="text-violet-300 font-semibold">{moodFor(palette[2])}</span></span>
          <button onClick={saveAsNote} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:text-emerald-300">
            <Save size={12} /> Save as Note
          </button>
        </div>

        {history.length > 0 && (
          <div>
            <div className="text-[10px] text-slate-500 tracking-wider mb-1.5">HISTORY</div>
            <div className="flex flex-col gap-1.5">
              {history.map((p, i) => (
                <button key={i} onClick={() => { setHistory((h) => h.filter((_, idx) => idx !== i)); setPalette(p); }} className="flex h-6 rounded overflow-hidden border border-white/10">
                  {p.map((hex, j) => <span key={j} className="flex-1" style={{ background: hex }} />)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorForgeApp;
