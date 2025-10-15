import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { VideoPlayer } from '../VideoPlayer';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';

export const OutputArea: React.FC = () => {
  const { 
    isGenerating, 
    isGeneratingAdvanced,
    error, 
    generatedImageUrl, 
    generatedVideoUrl 
  } = useAppContext();

  const hasContent = generatedImageUrl || generatedVideoUrl;

  return (
    <div className={`output-area ${hasContent ? 'has-content' : ''}`}>
      {(isGenerating || isGeneratingAdvanced) && <LoadingState />}
      
      {!(isGenerating || isGeneratingAdvanced) && !hasContent && !error && (
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
