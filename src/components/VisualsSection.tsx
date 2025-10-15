import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PromptEditor } from './PromptEditor';
import { StyleSelector } from './StyleSelector';
import { ResolutionSelector } from './ResolutionSelector';
import { VideoTypeSelector } from './VideoTypeSelector';
import { LyricsEditor } from './LyricsEditor';

export const VisualsSection: React.FC = () => {
  const { videoType } = useAppState();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
            3
          </span>
          Create Your Visuals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PromptEditor />
        <StyleSelector />
        <ResolutionSelector />
        <VideoTypeSelector />
        {videoType === 'lyrics' && <LyricsEditor />}
      </CardContent>
    </Card>
  );
};
