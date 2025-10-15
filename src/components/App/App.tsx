import React, { useState, useCallback } from 'react';
import { AppStateProvider } from '../../context/AppStateContext';
import { Style, Resolution, VideoType } from '../../context/AppContext';
import { AppHeader } from './AppHeader';
import { AppMain } from './AppMain';
import { ErrorBoundary } from '../ErrorBoundary';

const App: React.FC = () => {
  // Form state
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('cinematic');
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [videoType, setVideoType] = useState<VideoType>('visual');
  const [lyrics, setLyrics] = useState('');
  
  // File state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);

  const appState = {
    prompt,
    setPrompt,
    style,
    setStyle,
    resolution,
    setResolution,
    videoType,
    setVideoType,
    lyrics,
    setLyrics,
    audioFile,
    setAudioFile,
    sourceImageFile,
    setSourceImageFile,
  };

  return (
    <ErrorBoundary>
      <AppStateProvider value={appState}>
        <div className="app-container">
          <AppHeader />
          <AppMain />
        </div>
      </AppStateProvider>
    </ErrorBoundary>
  );
};

export default App;
