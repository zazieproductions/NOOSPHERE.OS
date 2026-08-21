import React, { useEffect, useRef, useState } from 'react';
import { clamp } from '../../lib/random';

interface P {
  x: number; y: number; a: number; speed: number; hue: number; life: number;
}

const VisionApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveRef = useRef<HTMLCanvasElement | null>(null);
  const [chaos, setChaos] = useState(55);
  const [luminosity, setLuminosity] = useState(65);
  const [frequency, setFrequency] = useState(40);
  const [insight, setInsight] = useState(28);
  const [eureka, setEureka] = useState(false);

  const chaosRef = useRef(chaos); chaosRef.current = chaos;
  const lumRef = useRef(luminosity); lumRef.current = luminosity;
  const freqRef = useRef(frequency); freqRef.current = frequency;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = (canvas.width = canvas.clientWidth);
    let h = (canvas.height = canvas.clientHeight);

    const particles: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.2 + 0.3,
      hue: Math.random() * 360,
      life: Math.random(),
    }));

    let raf = 0;
    let t = 0;
    const onResize = () => { w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight; };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const loop = () => {
      t += 0.01 + freqRef.current / 4000;
      ctx.fillStyle = 'rgba(4,5,9,0.18)';
      ctx.fillRect(0, 0, w, h);

      const chaosV = chaosRef.current / 100;
      const lumV = lumRef.current / 100;

      for (const p of particles) {
        const noise = Math.sin(p.x * 0.01 + t) * Math.cos(p.y * 0.01 + t) * chaosV * 4;
        p.a += noise * 0.05;
        p.x += Math.cos(p.a) * p.speed * (0.5 + chaosV);
        p.y += Math.sin(p.a) * p.speed * (0.5 + chaosV);
        p.hue += 0.3;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        const glow = 2 + lumV * 3;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue % 360}, 90%, ${50 + lumV * 20}%, ${0.5 + lumV * 0.4})`;
        ctx.shadowBlur = glow * 4;
        ctx.shadowColor = `hsla(${p.hue % 360},90%,60%,0.8)`;
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = (canvas.width = canvas.clientWidth);
    let h = (canvas.height = canvas.clientHeight);
    let raf = 0;
    let t = 0;
    const onResize = () => { w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight; };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const waves = [
      { color: '#00FFF2', amp: 14, freqBase: 0.02, phase: 0 },
      { color: '#FF2BD6', amp: 10, freqBase: 0.035, phase: 2 },
      { color: '#7CFF00', amp: 7, freqBase: 0.05, phase: 4 },
    ];

    const loop = () => {
      t += 0.04 + freqRef.current / 2000;
      ctx.clearRect(0, 0, w, h);
      waves.forEach((wv, i) => {
        ctx.beginPath();
        ctx.strokeStyle = wv.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        const midY = (h / (waves.length + 1)) * (i + 1);
        for (let x = 0; x < w; x += 4) {
          const chaosV = chaosRef.current / 100;
          const y = midY + Math.sin(x * wv.freqBase + t + wv.phase) * wv.amp * (0.6 + chaosV) + Math.sin(x * wv.freqBase * 3 + t * 1.7) * chaosV * 4;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setInsight((v) => {
        const next = clamp(v + (Math.random() - 0.42) * (6 + frequency / 8), 2, 100);
        if (next > 93 && !eureka) {
          setEureka(true);
          setTimeout(() => setEureka(false), 2200);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(id);
  }, [frequency, eureka]);

  const insightAngle = (insight / 100) * 270 - 135;

  return (
    <div className="w-full h-full flex flex-col bg-[#050609] text-slate-200 font-mono text-[11px]">
      <div className="relative flex-[3] min-h-0 border-b border-white/10">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {eureka && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[22px] font-black tracking-widest text-amber-300 animate-pulse" style={{ textShadow: '0 0 30px #ffb000' }}>
              EUREKA IMMINENT
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 text-[10px] text-slate-500 tracking-wider">VISIONARY FEELING SIMULATION</div>
      </div>

      <div className="flex-[2] min-h-0 flex">
        <div className="flex-1 border-r border-white/10 p-3 space-y-3 overflow-y-auto">
          <Slider label="Chaos" value={chaos} onChange={setChaos} color="#FF2BD6" />
          <Slider label="Luminosity" value={luminosity} onChange={setLuminosity} color="#00FFF2" />
          <Slider label="Frequency" value={frequency} onChange={setFrequency} color="#7CFF00" />
        </div>
        <div className="w-32 shrink-0 flex flex-col items-center justify-center gap-2 p-2">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff14" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#ffb000" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(insight / 100) * 264} 264`}
                style={{ transition: 'stroke-dasharray 0.4s' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-amber-300 font-bold text-[15px]">{Math.round(insight)}%</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 tracking-wider text-center">INSIGHT LEVEL</span>
          <div style={{ transform: `rotate(${insightAngle}deg)` }} className="hidden" />
        </div>
      </div>

      <div className="h-24 border-t border-white/10 shrink-0">
        <canvas ref={waveRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; color: string }> = ({ label, value, onChange, color }) => (
  <div>
    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
      <span>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" style={{ accentColor: color }} />
  </div>
);

export default VisionApp;
