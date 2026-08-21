import React, { useState } from 'react';
import { Save, Sparkles, Trash2 } from 'lucide-react';
import { ADJECTIVES, FIELDS, NOUNS, TAGS, THINKERS, VERB_PHRASES } from '../../data/wordbanks';
import { choice, randInt, randomHueHex } from '../../lib/random';
import { useNotes } from '../../context/NotesContext';

interface Idea {
  id: string;
  title: string;
  body: string;
  hex: string;
  tags: string[];
  confidence: number;
}

function synthesize(obscurity: number): Idea {
  const fieldA = choice(FIELDS);
  let fieldB = choice(FIELDS);
  while (fieldB === fieldA) fieldB = choice(FIELDS);
  const adjective = choice(ADJECTIVES);
  const noun = choice(NOUNS);
  const verb = choice(VERB_PHRASES);
  let body = `A ${adjective.toLowerCase()} ${noun.toLowerCase()} that ${verb} ${fieldA} and ${fieldB}`;
  if (obscurity > 55) body += `, filtered through the residue of ${choice(THINKERS)}`;
  if (obscurity > 85) body += `, then recompiled via ${choice(THINKERS)}'s discarded footnotes`;
  body += '.';
  const tags = Array.from({ length: 3 }, () => choice(TAGS));
  return {
    id: Math.random().toString(36).slice(2, 9),
    title: `${adjective} ${noun}`,
    body,
    hex: randomHueHex(),
    tags: Array.from(new Set(tags)),
    confidence: randInt(38, 99),
  };
}

const SynthesizerApp: React.FC = () => {
  const { addNote } = useNotes();
  const [obscurity, setObscurity] = useState(60);
  const [current, setCurrent] = useState<Idea | null>(null);
  const [history, setHistory] = useState<Idea[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSynthesize = () => {
    setSpinning(true);
    setTimeout(() => {
      const idea = synthesize(obscurity);
      setCurrent(idea);
      setHistory((h) => [idea, ...h].slice(0, 10));
      setSpinning(false);
    }, 420);
  };

  const handleSave = () => {
    if (!current) return;
    addNote({ title: current.title, body: current.body, hex: current.hex, tags: current.tags, origin: 'synth' });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07080d] text-slate-200 font-mono text-[12px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <button
            onClick={handleSynthesize}
            className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold tracking-widest text-[12px] transition-transform ${spinning ? 'scale-95' : 'hover:scale-105'}`}
            style={{ background: 'linear-gradient(135deg,#ff2bd6,#7c3aed)', color: '#fff', boxShadow: '0 0 30px -6px #ff2bd699' }}
          >
            <Sparkles size={16} className={spinning ? 'animate-spin' : ''} />
            SYNTHESIZE
          </button>

          <div className="mt-4 text-left">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>OBSCURITY BIAS</span>
              <span className="text-fuchsia-300">{obscurity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={obscurity}
              onChange={(e) => setObscurity(Number(e.target.value))}
              className="w-full accent-fuchsia-500"
            />
          </div>
        </div>

        {current && (
          <div className="rounded-lg border border-white/10 p-3.5 bg-white/[0.03]" style={{ borderLeft: `4px solid ${current.hex}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-slate-100 font-bold text-[14px]">{current.title}</h3>
              <span className="text-[10px] font-bold" style={{ color: current.hex }}>{current.hex}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[12px] mb-2.5">{current.body}</p>
            <div className="flex flex-wrap gap-1 mb-2.5">
              {current.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{t}</span>
              ))}
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>SYNTHESIS CONFIDENCE</span>
                <span>{current.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${current.confidence}%`, background: current.hex }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:text-emerald-300 transition-colors">
                <Save size={12} /> {savedFlash ? 'Saved!' : 'Save to Notes'}
              </button>
              <button onClick={() => setCurrent(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-red-400/60 hover:text-red-300 transition-colors">
                <Trash2 size={12} /> Discard
              </button>
            </div>
          </div>
        )}

        {!current && (
          <div className="text-center text-slate-500 text-[11px] py-6">
            press synthesize to fuse two disciplines into a genius idea.
          </div>
        )}

        {history.length > 0 && (
          <div>
            <div className="text-[10px] text-slate-500 tracking-wider mb-1.5">RECENT SYNTHESES</div>
            <div className="space-y-1.5">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setCurrent(h)}
                  className="w-full text-left px-2.5 py-1.5 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: h.hex }} />
                  <span className="truncate text-[11px] text-slate-300">{h.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynthesizerApp;
