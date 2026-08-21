import React, { useEffect, useState } from 'react';

const LINES = [
  'INITIALIZING COGNITIVE SUBSTRATE...',
  'MOUNTING /dev/subconscious...',
  'CALIBRATING DIVERGENT THINKING MATRIX... OK',
  'LOADING SPECTRUM 000000 \u2192 FFFFFF... OK',
  'INDEXING 324 LATENT NOTES...',
  'DECOMPRESSING MIND MAP TOPOLOGY...',
  'SYNTHESIZING OBSCURE REFERENCES...',
  'ESTABLISHING NEURAL SYNC... 98.6%',
  'PURGING IMPOSTER SYNDROME... DONE',
  'WELCOME, VISIONARY.',
];

const BootSequence: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [visible, setVisible] = useState<string[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisible(LINES.slice(0, i));
      if (i >= LINES.length) {
        clearInterval(id);
        setTimeout(() => setFading(true), 400);
        setTimeout(onDone, 1100);
      }
    }, 220);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center font-mono transition-opacity duration-700 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="w-[min(560px,90vw)]">
        <div className="text-cyan-300 text-xs tracking-[0.3em] mb-4">NOOSPHERE.OS \u2014 BOOT SEQUENCE</div>
        <div className="space-y-1 text-[12px] text-green-400">
          {visible.map((l, idx) => (
            <div key={idx} className={idx === visible.length - 1 && l === 'WELCOME, VISIONARY.' ? 'text-cyan-300 font-bold' : ''}>
              <span className="text-slate-600 mr-2">[{String(idx).padStart(2, '0')}]</span>
              {l}
            </div>
          ))}
          <span className="inline-block w-2 h-3.5 bg-green-400 animate-pulse align-middle" />
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
