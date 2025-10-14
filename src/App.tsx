import React, { useEffect } from 'react';
import ControlsPanel from './components/ControlsPanel';
import OutputArea from './components/OutputArea';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const { logoUrl, fetchLogo } = useAppContext();

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  return (
    <div className="container">
      <header className="app-header">
        {logoUrl && (
          <img
            id="app-logo"
            className="app-logo"
            src={logoUrl}
            alt="AI Music Video Generator Logo"
          />
        )}
        <h1>AI Music Video Generator</h1>
        <p>Your complete toolkit for audio analysis and music video creation.</p>
      </header>
      <main className="app-main">
        <ControlsPanel />
        <OutputArea />
      </main>
    </div>
  );
};

export default App;
