import React from 'react';
import UploadAndAnalyzeSection from './UploadAndAnalyzeSection';
import ImageUploadSection from './ImageUploadSection';
import CreateVisualsSection from './CreateVisualsSection';
import { useAppContext } from '../context/AppContext';
import { Button, LoadingSpinner } from './ui';

const ControlsPanel: React.FC = () => {
  const {
    audioFile,
    sourceImageFile,
    prompt,
    isGenerating,
    generate,
  } = useAppContext();

  const isGenerateDisabled =
    (!audioFile && !sourceImageFile) || !prompt || isGenerating;

  let buttonText = 'Generate Video';
  if (sourceImageFile && !audioFile) {
    buttonText = 'Edit Image';
  }

  return (
    <div className="controls-panel">
      <div className="controls-sections">
        <UploadAndAnalyzeSection />
        <ImageUploadSection />
        <CreateVisualsSection />
      </div>
      <div className="generate-section">
        <div className="generate-header">
          <h3 className="generate-title">
            <i className="fa-solid fa-magic-wand-sparkles"></i>
            Ready to Create?
          </h3>
          <p className="generate-subtitle">
            {isGenerateDisabled && !isGenerating 
              ? (!audioFile && !sourceImageFile 
                  ? "Upload an audio file or image to get started"
                  : !prompt.trim() 
                    ? "Add a description for your visuals"
                    : "Ready to generate!")
              : "Transform your vision into reality"
            }
          </p>
        </div>
        <Button
          id="generate-btn"
          className="generate-button"
          disabled={isGenerateDisabled}
          onClick={generate}
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
              <span>{buttonText}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ControlsPanel;
