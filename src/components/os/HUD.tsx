import React from 'react';
import { Radar, Zap, Waves } from 'lucide-react';
import { useSystemPulse } from '../../lib/useSystemPulse';

const HUD: React.FC = () => {
  const pulse = useSystemPulse(1100);

  return (
    <div className="fixed top-14 right-4 z-[9000] hidden lg:flex flex-col gap-2 w-48 font-mono">
      <div className="rounded-lg border border-white/10 bg-black/50 backdrop-blur-md p-3 space-y-2.5">
        <div className="text-[10px] tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
          <Radar size={11} className="text-cyan-300" /> COGNITION TELEMETRY
        </div>
        <Gauge label="Insight Flux" value={pulse.insight} color="#FFB000" icon={<Zap size={11} />} />
        <Gauge label="Idea Entropy" value={pulse.entropy} color="#FF2BD6" icon={<Waves size={11} />} />
        <Gauge label="Divergence" value={pulse.creativity} color="#00FFF2" icon={<Radar size={11} />} />
      </div>
    </div>
  );
};

const Gauge: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
  <div>
    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
      <span className="flex items-center gap-1">{icon}{label}</span>
      <span style={{ color }}>{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
  </div>
);

export default HUD;
