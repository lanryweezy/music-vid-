import React, { createContext, useContext, ReactNode } from 'react';
import { Style, Resolution, VideoType } from './AppContext';

interface AppState {
  // Form state
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: Style;
  setStyle: (style: Style) => void;
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  videoType: VideoType;
  setVideoType: (videoType: VideoType) => void;
  lyrics: string;
  setLyrics: (lyrics: string) => void;
  
  // File state
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  sourceImageFile: File | null;
  setSourceImageFile: (file: File | null) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: ReactNode;
  value: AppState;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children, value }) => {
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
