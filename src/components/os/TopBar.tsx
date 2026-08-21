import React, { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { useSystemPulse } from '../../lib/useSystemPulse';

const TopBar: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const pulse = useSystemPulse();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="fixed top-0 left-0 right-0 h-10 z-[9000] flex items-center justify-between px-4 border-b border-white/5 bg-black/50 backdrop-blur-md font-mono text-[11px] text-slate-300">
      <div className="flex items-center gap-2 text-cyan-300 tracking-[0.2em] font-semibold">
        <BrainCircuit size={15} className="text-cyan-300" />
        NOOSPHERE.OS
        <span className="hidden sm:inline text-slate-500 font-normal tracking-normal ml-2">
          v3.14159 &mdash; polymath kernel
        </span>
      </div>

      <div className="hidden md:flex items-center gap-5">
        <StatChip label="CREATIVITY" value={pulse.creativity} color="#00FFF2" />
        <StatChip label="ENTROPY" value={pulse.entropy} color="#FF2BD6" />
        <StatChip label="NEURAL SYNC" value={pulse.sync} color="#7CFF00" />
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span>{date}</span>
        <span className="text-cyan-300 tabular-nums">{time}</span>
      </div>
    </div>
  );
};

const StatChip: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-slate-500">{label}</span>
    <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="tabular-nums w-7" style={{ color }}>{Math.round(value)}</span>
  </div>
);

export default TopBar;
