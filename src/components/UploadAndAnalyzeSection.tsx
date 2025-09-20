import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UploadAndAnalyzeSection: React.FC = () => {
  const {
    audioFile,
    setAudioFile,
    analysisResult,
    isAnalyzing,
    analyzeAudio,
  } = useAppContext();

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAudioFile(event.target.files[0]);
    } else {
      setAudioFile(null);
    }
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="audio-upload">Audio File</Label>
          <Input id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} />
          <p className="text-sm text-muted-foreground">
            {audioFile ? audioFile.name : 'No file selected.'}
          </p>
        </div>

        <div className="musicians-toolkit space-y-4">
          <h3 className="text-lg font-semibold">Musician's Toolkit</h3>
          <Button
            onClick={analyzeAudio}
            disabled={!audioFile || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
          </Button>
          {isAnalyzing && <div className="loader-small mx-auto"></div>}
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
            <h4 className="font-semibold">Metronome</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue={
                  analysisResult ? Math.round(analysisResult.bpm) : 120
                }
                min="40"
                max="240"
                className="w-20"
              />
              <Button variant="outline" size="icon">
                <i className="fa-solid fa-play"></i>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadAndAnalyzeSection;
