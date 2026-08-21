import { useEffect, useRef, useState } from 'react';
import { clamp } from './random';

export interface Pulse {
  creativity: number;
  entropy: number;
  sync: number;
  insight: number;
}

export function useSystemPulse(intervalMs = 1400): Pulse {
  const [pulse, setPulse] = useState<Pulse>({ creativity: 62, entropy: 41, sync: 78, insight: 33 });
  const ref = useRef(pulse);
  ref.current = pulse;

  useEffect(() => {
    const id = setInterval(() => {
      setPulse((p) => ({
        creativity: clamp(p.creativity + (Math.random() - 0.45) * 9, 12, 99),
        entropy: clamp(p.entropy + (Math.random() - 0.5) * 11, 5, 97),
        sync: clamp(p.sync + (Math.random() - 0.5) * 7, 20, 99),
        insight: clamp(p.insight + (Math.random() - 0.4) * 14, 4, 100),
      }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return pulse;
}
