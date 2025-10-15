import React from 'react';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { VideoPlayer } from '../VideoPlayer';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';

export const OutputArea: React.FC = () => {
  const { 
    isGenerating, 
    error, 
    generatedImageUrl, 
    generatedVideoUrl 
  } = useVideoGeneration();

  const hasContent = generatedImageUrl || generatedVideoUrl;

  return (
    <div className={`output-area ${hasContent ? 'has-content' : ''}`}>
      {isGenerating && <LoadingState />}
      
      {!isGenerating && !hasContent && !error && (
        <VideoPlayer.Placeholder />
      )}
      
      {error && <ErrorState error={error} />}
      
      {generatedImageUrl && (
        <VideoPlayer.ImageResult url={generatedImageUrl} />
      )}
      
      {generatedVideoUrl && (
        <VideoPlayer.VideoResult url={generatedVideoUrl} />
      )}
    </div>
  );
};
