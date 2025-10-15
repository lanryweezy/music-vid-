import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { AdvancedMusicVideoSection } from '../AdvancedMusicVideoSection';
import { UploadSection } from '../UploadSection';
import { VisualsSection } from '../VisualsSection';
import { GenerateSection } from '../GenerateSection';

export const ControlsPanel: React.FC = () => {
  const { 
    audioFile, 
    sourceImageFile, 
    prompt, 
    isGenerating, 
    isGeneratingAdvanced,
    generate,
    generateAdvancedMusicVideo
  } = useAppContext();

  const isGenerateDisabled = (!audioFile && !sourceImageFile) || !prompt.trim() || isGenerating || isGeneratingAdvanced;

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
      <div className="mt-6">
        <AdvancedMusicVideoSection />
      </div>
    </div>
  );
};
