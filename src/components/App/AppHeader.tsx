import React from 'react';
import ProgressIndicator from '../ProgressIndicator';

export const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-text">
          <h1>AI Music Video Generator</h1>
          <p>Transform your audio into stunning visuals with AI-powered creativity</p>
        </div>
      </div>
      <ProgressIndicator />
    </header>
  );
};
