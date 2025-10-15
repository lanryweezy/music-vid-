import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, LoadingSpinner } from './ui';

export const GenerateSection: React.FC = () => {
  const { 
    audioFile, 
    sourceImageFile, 
    prompt, 
    style, 
    resolution, 
    videoType, 
    lyrics,
    isGenerating,
    generate,
    error
  } = useAppContext();

  const handleGenerate = async () => {
    const params = {
      prompt,
      style,
      resolution,
      videoType,
      lyrics: videoType === 'lyrics' ? lyrics : undefined,
      imageFile: sourceImageFile || undefined,
      fontFamily: 'Arial',
      fontSize: 24,
      fontColor: '#FFFFFF',
      animationStyle: 'fade' as const,
    };

    const audioFileRef = audioFile || undefined;
    generate();
  };

  const isDisabled = (!audioFile && !sourceImageFile) || !prompt.trim() || isGenerating;

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
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
