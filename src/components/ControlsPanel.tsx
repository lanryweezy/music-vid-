import React from 'react';
import UploadAndAnalyzeSection from './UploadAndAnalyzeSection';
import ImageUploadSection from './ImageUploadSection';
import CreateVisualsSection from './CreateVisualsSection';
import { useAppContext } from '../context/AppContext';

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
      <UploadAndAnalyzeSection />
      <ImageUploadSection />
      <CreateVisualsSection />
      <button
        id="generate-btn"
        className="primary-action"
        disabled={isGenerateDisabled}
        onClick={generate}
      >
        {isGenerating ? (
          'Generating...'
        ) : (
          <>
            <i className="fa-solid fa-diamond"></i> {buttonText}
          </>
        )}
      </button>
    </div>
  );
};

export default ControlsPanel;
