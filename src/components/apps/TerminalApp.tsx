import React, { useEffect, useRef, useState } from 'react';
import { useOS, APP_REGISTRY } from '../../context/OSContext';
import { choice, randomHueHex } from '../../lib/random';
import { ADJECTIVES, FIELDS, NOUNS, THINKERS, VERB_PHRASES } from '../../data/wordbanks';
import type { AppId } from '../../types';

interface Props {
  onClose: () => void;
}

const BANNER = [
  ' _   _  ____   ___  ____  ____  _   _ _____ ____  _____ ',
  '| \\ | |/ __ \\ / _ \\/ ___||  _ \\| | | | ____|  _ \\| ____|',
  '|  \\| | |  | | | | \\___ \\| |_) | |_| |  _| | |_) |  _|  ',
  '| |\\  | |__| | |_| |___) |  __/|  _  | |___|  _ <| |___ ',
  '|_| \\_|\\____/ \\___/|____/|_|   |_| |_|_____|_| \\_\\_____|',
  '',
  "type 'help' for a list of commands.",
];

const TerminalApp: React.FC<Props> = ({ onClose }) => {
  const { openApp } = useOS();
  const [lines, setLines] = useState<string[]>(BANNER);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const print = (...ls: string[]) => setLines((p) => [...p, ...ls]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`root@noosphere:~$ ${cmd}`);
    setHistory((h) => [cmd, ...h]);
    setHistIdx(null);
    const [name, ...args] = cmd.split(' ');

    switch (name.toLowerCase()) {
      case 'help':
        print(
          'AVAILABLE COMMANDS:',
          '  help                show this list',
          '  whoami              print operator identity',
          '  date                print current date/time',
          '  ls                  list installed apps',
          '  open <app>          launch an app window',
          '  idea                synthesize a quick concept',
          '  color               emit a random hex code',
          '  matrix              enter the matrix (briefly)',
          '  echo <text>         repeat text back',
          '  sudo make-genius    attempt self-elevation',
          '  clear               clear the terminal',
        );
        break;
      case 'whoami':
        print('operator: THE VISIONARY (polymath-tier, unverified)');
        break;
      case 'date':
        print(new Date().toString());
        break;
      case 'ls':
        print(...Object.values(APP_REGISTRY).map((a) => `  ${a.id.padEnd(12)} ${a.title}`));
        break;
      case 'open': {
        const target = args[0] as AppId | undefined;
        if (target && APP_REGISTRY[target]) {
          openApp(target);
          print(`launching ${APP_REGISTRY[target].title}...`);
        } else {
          print(`unknown app: ${args[0] ?? ''}. try 'ls'.`);
        }
        break;
      }
      case 'idea': {
        const a = choice(FIELDS);
        let b = choice(FIELDS);
        while (b === a) b = choice(FIELDS);
        print(`>> a ${choice(ADJECTIVES).toLowerCase()} ${choice(NOUNS).toLowerCase()} that ${choice(VERB_PHRASES)} ${a} and ${b}, via ${choice(THINKERS)}.`);
        break;
      }
      case 'color':
        print(`>> ${randomHueHex()}`);
        break;
      case 'matrix': {
        const rows = Array.from({ length: 6 }, () =>
          Array.from({ length: 40 }, () => (Math.random() > 0.5 ? '1' : '0')).join('')
        );
        print(...rows);
        break;
      }
      case 'echo':
        print(args.join(' '));
        break;
      case 'sudo':
        if (args.join(' ') === 'make-genius') {
          print('permission denied: genius cannot be sudo\'d. it must be synthesized.');
        } else {
          print('sudo: command not recognized in this reality.');
        }
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        onClose();
        break;
      default:
        print(`command not found: ${name} — try 'help'`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIdx === null ? 0 : Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === null) return;
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(null); setInput(''); }
      else { setHistIdx(next); setInput(history[next]); }
    }
  };

  return (
    <div
      className="w-full h-full bg-black text-green-400 font-mono text-[11.5px] p-3 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap leading-[1.5]">{l}</div>
      ))}
      <div className="flex items-center gap-1">
        <span className="text-cyan-400 shrink-0">root@noosphere:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          className="flex-1 bg-transparent outline-none text-green-300 caret-green-400"
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;
