import { useEffect, useState } from 'react';
import BootSequence from './components/os/BootSequence';
import Desktop from './components/os/Desktop';
import { NotesProvider } from './context/NotesContext';
import { OSProvider, useOS } from './context/OSContext';

const DesktopBootstrap: React.FC = () => {
  const { openApp } = useOS();
  useEffect(() => {
    openApp('mindmap');
    openApp('notes');
    openApp('synth');
  }, [openApp]);
  return <Desktop />;
};

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <NotesProvider>
      <OSProvider>
        {!booted && <BootSequence onDone={() => setBooted(true)} />}
        {booted && <DesktopBootstrap />}
      </OSProvider>
    </NotesProvider>
  );
}

export default App;
