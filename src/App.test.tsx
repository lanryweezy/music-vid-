import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { AppProvider } from './context/AppContext';
import { AppStateProvider } from './context/AppStateContext';

describe('App', () => {
  it('renders the main heading', () => {
    const appState = {
      prompt: '',
      setPrompt: vi.fn(),
      style: 'cinematic' as const,
      setStyle: vi.fn(),
      resolution: '720p' as const,
      setResolution: vi.fn(),
      videoType: 'visual' as const,
      setVideoType: vi.fn(),
      lyrics: '',
      setLyrics: vi.fn(),
      audioFile: null,
      setAudioFile: vi.fn(),
      sourceImageFile: null,
      setSourceImageFile: vi.fn(),
    };

    render(
      <AppProvider>
        <AppStateProvider value={appState}>
          <App />
        </AppStateProvider>
      </AppProvider>
    );
    expect(screen.getByText('AI Music Video Generator')).toBeInTheDocument();
  });
});
