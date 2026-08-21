import React from 'react';
import BackgroundField from './BackgroundField';
import TopBar from './TopBar';
import Dock from './Dock';
import HUD from './HUD';
import Window from './Window';
import { useOS } from '../../context/OSContext';
import MindMapApp from '../apps/MindMapApp';
import NotesApp from '../apps/NotesApp';
import SynthesizerApp from '../apps/SynthesizerApp';
import VisionApp from '../apps/VisionApp';
import ColorForgeApp from '../apps/ColorForgeApp';
import TerminalApp from '../apps/TerminalApp';
import AboutApp from '../apps/AboutApp';

const Desktop: React.FC = () => {
  const { windows, closeWindow, focusWindow, minimizeWindow, moveWindow, resizeWindow } = useOS();

  const topZ = windows.reduce((m, w) => Math.max(m, w.z), 0);

  const renderApp = (appId: string, winId: string) => {
    switch (appId) {
      case 'mindmap': return <MindMapApp />;
      case 'notes': return <NotesApp />;
      case 'synth': return <SynthesizerApp />;
      case 'vision': return <VisionApp />;
      case 'colorforge': return <ColorForgeApp />;
      case 'terminal': return <TerminalApp onClose={() => closeWindow(winId)} />;
      case 'about': return <AboutApp />;
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BackgroundField />
      <TopBar />
      <HUD />
      <div className="absolute inset-0 pt-10">
        {windows.map((w) => (
          <Window
            key={w.id}
            win={w}
            focused={w.z === topZ}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onMove={(x, y) => moveWindow(w.id, x, y)}
            onResize={(w2, h2) => resizeWindow(w.id, w2, h2)}
          >
            {renderApp(w.appId, w.id)}
          </Window>
        ))}
      </div>
      <Dock />
    </div>
  );
};

export default Desktop;
