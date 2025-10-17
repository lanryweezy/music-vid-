import React, { useEffect } from 'react';
import ControlsPanel from './components/ControlsPanel';
import OutputArea from './components/OutputArea';
import ProgressIndicator from './components/ProgressIndicator';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const { logoUrl, fetchLogo } = useAppContext();

  useEffect(() => {
    // Try to fetch logo, but don't let it interfere with the app
    fetchLogo().catch(() => {
      // Silently handle logo fetch errors
      console.log('Logo generation failed, using fallback');
    });
  }, [fetchLogo]);

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-content">
          {logoUrl && (
            <img
              id="app-logo"
              className="app-logo"
              src={logoUrl}
              alt="AI Music Video Generator Logo"
            />
          )}
          <div className="header-text">
            <h1>AI Music Video Generator</h1>
            <p>Transform your audio into stunning visuals with AI-powered creativity</p>
          </div>
        </div>
        <ProgressIndicator />
      </header>
      <main className="app-main">
        <div className="main-content">
          <ControlsPanel />
          <OutputArea />
        </div>
      </main>
    </div>
  );
};

export default App;
