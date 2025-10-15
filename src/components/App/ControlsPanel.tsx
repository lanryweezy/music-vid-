import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { UploadSection } from '../UploadSection';
import { VisualsSection } from '../VisualsSection';
import { GenerateSection } from '../GenerateSection';

export const ControlsPanel: React.FC = () => {
  const { audioFile, sourceImageFile, prompt } = useAppState();
  const { isGenerating, generate } = useVideoGeneration();

  const isGenerateDisabled = (!audioFile && !sourceImageFile) || !prompt.trim() || isGenerating;

  return (
    <div className="controls-panel">
      <div className="controls-sections">
        <UploadSection />
        <VisualsSection />
      </div>
      <GenerateSection 
        isDisabled={isGenerateDisabled}
        isGenerating={isGenerating}
        onGenerate={generate}
      />
    </div>
  );
};
