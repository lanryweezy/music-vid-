import { useState, useCallback } from 'react';
import { analyzeAudio, AnalysisResult } from '../services/gemini';

export const useAudioAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (audioFile: File) => {
    if (!audioFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const result = await analyzeAudio(audioFile);
      setAnalysisResult(result);
      return result;
    } catch (error) {
      const errorMessage = 'Failed to analyze audio. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyze,
    reset,
  };
};
