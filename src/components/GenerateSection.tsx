import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import { Button, LoadingSpinner } from './ui';

interface GenerateSectionProps {
  isDisabled: boolean;
  isGenerating: boolean;
  onGenerate: (params: any, audioFile?: File) => Promise<void>;
}

export const GenerateSection: React.FC<GenerateSectionProps> = ({
  isDisabled,
  isGenerating,
  onGenerate,
}) => {
  const { 
    audioFile, 
    sourceImageFile, 
    prompt, 
    style, 
    resolution, 
    videoType, 
    lyrics 
  } = useAppState();

  const handleGenerate = async () => {
    const params = {
      prompt,
      style,
      resolution,
      videoType,
      lyrics: videoType === 'lyrics' ? lyrics : undefined,
      imageFile: sourceImageFile || undefined,
    };

    await onGenerate(params, audioFile || undefined);
  };

  const getButtonText = () => {
    if (sourceImageFile && !audioFile) {
      return 'Edit Image';
    }
    return 'Generate Video';
  };

  const getSubtitle = () => {
    if (isDisabled && !isGenerating) {
      if (!audioFile && !sourceImageFile) {
        return "Upload an audio file or image to get started";
      }
      if (!prompt.trim()) {
        return "Add a description for your visuals";
      }
      return "Ready to generate!";
    }
    return "Transform your vision into reality";
  };

  return (
    <div className="generate-section">
      <div className="generate-header">
        <h3 className="generate-title">
          <i className="fa-solid fa-magic-wand-sparkles"></i>
          Ready to Create?
        </h3>
        <p className="generate-subtitle">{getSubtitle()}</p>
      </div>
      <Button
        className="generate-button"
        disabled={isDisabled}
        onClick={handleGenerate}
        size="lg"
      >
        {isGenerating ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Generating Your Video...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-magic-wand-sparkles"></i>
            <span>{getButtonText()}</span>
          </>
        )}
      </Button>
    </div>
  );
};
