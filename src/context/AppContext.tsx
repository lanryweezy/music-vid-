import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  generateLogo,
  analyzeAudio,
  AnalysisResult,
  editImage,
  generateVideo,
} from '../services/gemini';

export type Style =
  | 'cinematic'
  | 'street-art-graffiti'
  | '90s-vhs-camcorder'
  | 'gold-and-bling'
  | 'vintage-film'
  | 'animated-doodles'
  | 'surreal'
  | 'anime';

export type Resolution = '720p' | '1080p';
export type VideoType = 'visual' | 'lyrics';

// Define the shape of the context state
interface IAppContext {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  sourceImageFile: File | null;
  setSourceImageFile: (file: File | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: Style;
  setStyle: (style: Style) => void;
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  videoType: VideoType;
  setVideoType: (videoType: VideoType) => void;
  lyrics: string;
  setLyrics: (lyrics: string) => void;
  logoUrl: string | null;
  fetchLogo: () => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analyzeAudio: () => void;
  isGenerating: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  generatedVideoUrl: string | null;
  generatedImageUrl: string | null;
  generate: () => void;
}

// Create the context
const AppContext = createContext<IAppContext | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('cinematic');
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [videoType, setVideoType] = useState<VideoType>('visual');
  const [lyrics, setLyrics] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );

  const fetchLogo = async () => {
    try {
      const url = await generateLogo();
      setLogoUrl(url);
    } catch (error) {
      console.error('Failed to fetch logo:', error);
      // Don't set error state for logo generation failure
      // This prevents it from interfering with the output area
      setLogoUrl(null);
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!audioFile) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeAudio(audioFile);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze audio:', error);
      setError('Failed to analyze audio.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedVideoUrl(null);

    try {
      if (sourceImageFile && !audioFile) {
        // Edit image
        const blob = await editImage(sourceImageFile, prompt);
        setGeneratedImageUrl(URL.createObjectURL(blob));
      } else if (audioFile) {
        // Generate video
        const blob = await generateVideo({
          prompt,
          style,
          resolution,
          videoType,
          lyrics,
          imageFile: sourceImageFile || undefined,
        });
        setGeneratedVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setError('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const value = {
    audioFile,
    setAudioFile,
    sourceImageFile,
    setSourceImageFile,
    prompt,
    setPrompt,
    style,
    setStyle,
    resolution,
    setResolution,
    videoType,
    setVideoType,
    lyrics,
    setLyrics,
    logoUrl,
    fetchLogo,
    analysisResult,
    isAnalyzing,
    analyzeAudio: handleAnalyzeAudio,
    isGenerating,
    error,
    setError,
    generatedVideoUrl,
    generatedImageUrl,
    generate: handleGenerate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
