import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, FileUpload, Slider, Toggle, LoadingSpinner } from './ui';

const UploadAndAnalyzeSection: React.FC = () => {
  const {
    audioFile,
    setAudioFile,
    analysisResult,
    isAnalyzing,
    analyzeAudio,
  } = useAppContext();

  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);

  const handleAudioUpload = (file: File | null) => {
    setAudioFile(file);
  };

  const handleMetronomeToggle = () => {
    setIsMetronomePlaying(!isMetronomePlaying);
  };

  return (
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
          <Label>Audio File</Label>
          <FileUpload
            accept="audio/*"
            onFileSelect={handleAudioUpload}
            selectedFile={audioFile}
            placeholder="Drop your audio file here or click to browse"
            icon="fa-music"
            maxSize={100}
          />
        </div>

        <div className="musicians-toolkit space-y-4">
          <Button
            onClick={analyzeAudio}
            disabled={!audioFile || isAnalyzing}
            className="w-full analyze-button"
          >
            {isAnalyzing ? (
              <>
                <LoadingSpinner size="sm" />
                Analyzing Audio...
              </>
            ) : (
              <>
                <i className="fa-solid fa-chart-line"></i>
                Analyze Audio
              </>
            )}
          </Button>
          {analysisResult && (
            <div className="analysis-result space-y-2">
              <div className="flex justify-between">
                <strong>BPM</strong>
                <span>{Math.round(analysisResult.bpm)}</span>
              </div>
              <div className="flex justify-between">
                <strong>Chords</strong>
                <span>{analysisResult.chords.join(', ')}</span>
              </div>
            </div>
          )}
          <div className="metronome">
            <h4 className="font-semibold flex items-center gap-2">
              <i className="fa-solid fa-drum"></i>
              Metronome
            </h4>
            <div className="metronome-controls">
              <Slider
                value={analysisResult ? Math.round(analysisResult.bpm) : metronomeBpm}
                onChange={setMetronomeBpm}
                min={40}
                max={240}
                step={1}
                label="BPM"
                unit=""
                className="metronome-slider"
              />
              <Toggle
                checked={isMetronomePlaying}
                onChange={handleMetronomeToggle}
                label={isMetronomePlaying ? "Playing" : "Stopped"}
                description={isMetronomePlaying ? `Clicking at ${metronomeBpm} BPM` : "Click to start metronome"}
                size="md"
                className="metronome-toggle"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadAndAnalyzeSection;
