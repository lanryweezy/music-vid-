import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileUpload } from './ui';
import { AudioAnalysis } from './AudioAnalysis';

export const UploadSection: React.FC = () => {
  const { audioFile, setAudioFile, sourceImageFile, setSourceImageFile } = useAppState();
  
  const audioUpload = useFileUpload({
    maxSize: 100,
    acceptedTypes: ['audio/*'],
    onFileSelect: setAudioFile,
  });

  const imageUpload = useFileUpload({
    maxSize: 50,
    acceptedTypes: ['image/*'],
    onFileSelect: setSourceImageFile,
  });

  const audioAnalysis = useAudioAnalysis();

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
              {...audioUpload}
              placeholder="Drop your audio file here or click to browse"
              icon="fa-music"
            />
          </div>

          {audioFile && (
            <AudioAnalysis 
              audioFile={audioFile}
              {...audioAnalysis}
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
              {...imageUpload}
              placeholder="Drop your image here or click to browse"
              icon="fa-image"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
