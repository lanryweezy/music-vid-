import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Textarea } from './ui/textarea';

export const LyricsEditor: React.FC = () => {
  const { lyrics, setLyrics } = useAppState();

  return (
    <div className="space-y-2">
      <label htmlFor="lyrics-input" className="text-sm font-medium">
        Lyrics
      </label>
      <Textarea
        id="lyrics-input"
        placeholder="Paste your song lyrics here..."
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        rows={6}
      />
    </div>
  );
};
