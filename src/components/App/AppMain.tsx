import React from 'react';
import { ControlsPanel } from './ControlsPanel';
import { OutputArea } from './OutputArea';

export const AppMain: React.FC = () => {
  return (
    <main className="app-main">
      <div className="main-content">
        <ControlsPanel />
        <OutputArea />
      </div>
    </main>
  );
};
