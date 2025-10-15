import React from 'react';
import { Button, LoadingSpinner, Slider, Toggle } from './ui';
import { useState } from 'react';

interface AudioAnalysisProps {
  audioFile: File;
  isAnalyzing: boolean;
  analysisResult: any;
  error: string | null;
  analyze: (file: File) => Promise<any>;
}

export const AudioAnalysis: React.FC<AudioAnalysisProps> = ({
  audioFile,
  isAnalyzing,
  analysisResult,
  error,
  analyze,
}) => {
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);

  const handleAnalyze = () => {
    analyze(audioFile);
  };

  const handleMetronomeToggle = () => {
    setIsMetronomePlaying(!isMetronomePlaying);
  };

  return (
    <div className="audio-analysis space-y-4">
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
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

      {error && (
        <div className="analysis-error" role="alert">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

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
  );
};
