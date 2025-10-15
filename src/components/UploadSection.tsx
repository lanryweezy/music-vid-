import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileUpload } from './ui';
import { AudioAnalysis } from './AudioAnalysis';

export const UploadSection: React.FC = () => {
  const { 
    audioFile, 
    setAudioFile, 
    sourceImageFile, 
    setSourceImageFile,
    analysisResult,
    isAnalyzing,
    analyzeAudio,
    metronomeBpm,
    toggleMetronome,
    isMetronomePlaying
  } = useAppContext();
  
  const handleAudioFileSelect = (file: File | null) => {
    setAudioFile(file);
    // Reset analysis when a new file is selected
    if (!file) {
      // Optionally reset other related states
    }
  };

  const handleImageFileSelect = (file: File | null) => {
    setSourceImageFile(file);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
              1
            </span>
            Upload & Analyze
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <FileUpload
              onFileSelect={handleAudioFileSelect}
              maxSize={100}
              acceptedTypes={['audio/*']}
              placeholder="Drop your audio file here or click to browse"
              icon="fa-music"
              currentFile={audioFile}
            />
          </div>

          {audioFile && (
            <AudioAnalysis
              audioFile={audioFile}
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
              onAnalyze={analyzeAudio}
              metronomeBpm={metronomeBpm}
              toggleMetronome={toggleMetronome}
              isMetronomePlaying={isMetronomePlaying}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
              2
            </span>
            Add Your Image (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image File</label>
            <FileUpload
              onFileSelect={handleImageFileSelect}
              maxSize={50}
              acceptedTypes={['image/*']}
              placeholder="Drop your image here or click to browse"
              icon="fa-image"
              currentFile={sourceImageFile}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
