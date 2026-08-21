import React from 'react';
import { Atom, BookOpen, Compass, Feather, Gem, Infinity as InfinityIcon } from 'lucide-react';

const MASTERY = [
  { icon: Atom, label: 'Quantum Semiotics' },
  { icon: BookOpen, label: 'Hauntological Branding' },
  { icon: Compass, label: 'Speculative Cartography' },
  { icon: Feather, label: 'Post-Digital Typography' },
  { icon: Gem, label: 'Applied Mycology' },
  { icon: InfinityIcon, label: 'Recursive Mythmaking' },
];

const OBSESSIONS = [
  'the smell of Helvetica', 'why hexagons feel more honest than squares', 'Kondratiev waves as tarot',
  'a font that only whispers', 'the color of Tuesday', 'building a religion around latency',
];

const AboutApp: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#07080d] text-slate-200 font-mono text-[12px]">
      <div className="relative h-28 shrink-0 overflow-hidden">
        <img src="/img/wallpaper.png" alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-transparent to-[#07080d]/40" />
        <div className="absolute -bottom-9 left-4">
          <img
            src="/img/avatar.png"
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-red-400/70 object-cover"
            style={{ boxShadow: '0 0 30px -4px #ff5252aa' }}
          />
        </div>
      </div>

      <div className="pt-11 px-4 pb-4 space-y-4">
        <div>
          <h2 className="text-slate-100 font-bold text-[16px]">DR. VESSEL QUIRE</h2>
          <p className="text-red-300 text-[11px]">Polymathic Visionary &middot; Chief Ontology Officer &middot; Unlicensed Futurist</p>
        </div>

        <p className="text-slate-400 leading-relaxed text-[11.5px] italic border-l-2 border-red-400/50 pl-3">
          "I don't have ideas. I have collisions. My job is to stand in the wreckage
          and take notes before the insurance adjuster of consensus reality arrives."
        </p>

        <div>
          <div className="text-[10px] text-slate-500 tracking-widest mb-2">FIELDS OF MASTERY</div>
          <div className="grid grid-cols-2 gap-2">
            {MASTERY.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-2.5 py-2 rounded border border-white/10 bg-white/[0.03]">
                <Icon size={14} className="text-red-300 shrink-0" />
                <span className="text-[10.5px] text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-500 tracking-widest mb-2">CURRENT OBSESSIONS</div>
          <ul className="space-y-1">
            {OBSESSIONS.map((o) => (
              <li key={o} className="text-[11px] text-slate-400 flex gap-2">
                <span className="text-red-400">&raquo;</span>{o}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[10px] text-slate-500 tracking-widest mb-1.5">CREDENTIALS (SELF-CONFERRED)</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            PhD in Applied Vibes, Institute for Nonlinear Studies. Visiting fellow at
            three think tanks that may not exist. Author of <em>The Hex Codex</em>, an
            unpublished treatise on color as prophecy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
