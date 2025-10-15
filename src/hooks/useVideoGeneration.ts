import { useState, useCallback } from 'react';
import { editImage, generateVideo } from '../services/gemini';
import { Style, Resolution, VideoType } from '../context/AppContext';

interface GenerationParams {
  prompt: string;
  style: Style;
  resolution: Resolution;
  videoType: VideoType;
  lyrics?: string;
  imageFile?: File;
}

export const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const generate = useCallback(async (params: GenerationParams, audioFile?: File) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedVideoUrl(null);

    try {
      if (params.imageFile && !audioFile) {
        // Edit image mode
        const blob = await editImage(params.imageFile, params.prompt);
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImageUrl(imageUrl);
        return { type: 'image' as const, url: imageUrl };
      } else if (audioFile) {
        // Generate video mode
        const blob = await generateVideo({
          prompt: params.prompt,
          style: params.style,
          resolution: params.resolution,
          videoType: params.videoType,
          lyrics: params.lyrics,
          imageFile: params.imageFile,
        });
        const videoUrl = URL.createObjectURL(blob);
        setGeneratedVideoUrl(videoUrl);
        return { type: 'video' as const, url: videoUrl };
      } else {
        throw new Error('No audio file or image file provided');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  const clearResults = useCallback(() => {
    if (generatedVideoUrl) {
      URL.revokeObjectURL(generatedVideoUrl);
    }
    if (generatedImageUrl) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
  }, [generatedVideoUrl, generatedImageUrl]);

  return {
    isGenerating,
    error,
    generatedVideoUrl,
    generatedImageUrl,
    generate,
    reset,
    clearResults,
  };
};
