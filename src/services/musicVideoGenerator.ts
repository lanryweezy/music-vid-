import { GoogleGenAI } from '@google/genai';
import { Style, Resolution } from "../context/AppContext";

if (!process.env.API_KEY) {
  console.warn('API_KEY is not defined. Music video generation services will not work.');
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

/**
 * Advanced music video generation workflow using Google's Imagen and Veo models
 * 1. Analyzes the audio file to understand rhythm, tempo, and mood
 * 2. Generates multiple related images using Google's Imagen model based on the theme and audio analysis
 * 3. Creates a coherent video from the generated images synchronized to the audio using Google's Veo model
 */
export const generateAdvancedMusicVideo = async (
  audioFile: File,
  prompt: string,
  style: Style,
  resolution: Resolution,
  onProgress?: (progress: number, stage: string) => void
): Promise<Blob> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    // Stage 1: Analyze the audio
    onProgress?.(10, 'Analyzing audio...');
    const audioAnalysis = await analyzeAudioForVideoGeneration(audioFile);
    
    // Stage 2: Generate multiple related images based on the prompt and analysis using Google's Imagen model
    onProgress?.(30, 'Generating visual scenes with Imagen model...');
    const imageUrls = await generateMultipleVisualScenes(prompt, style, audioAnalysis);

    // Stage 3: Generate video from images and audio using Google's Veo model
    onProgress?.(70, 'Creating music video with Veo model...');
    const videoBlob = await createVideoFromScenesAndAudio(
      imageUrls,
      audioFile,
      audioAnalysis,
      style,
      resolution
    );

    onProgress?.(100, 'Complete!');
    return videoBlob;
  } catch (error) {
    console.error('Advanced music video generation failed:', error);
    throw error;
  }
};

/**
 * Analyze audio specifically for video generation
 */
const analyzeAudioForVideoGeneration = async (audioFile: File) => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    const audioPart = await fileToGenerativePart(audioFile);
    const promptText = `Analyze this audio file for video generation. Determine BPM (beats per minute), sections (verse, chorus, bridge), tempo changes, and overall mood/emotion. Provide detailed information that would help synchronize visual transitions with the music. Respond with a JSON object containing: bpm, sections (array of {name, startTime, endTime, mood}), and overallMood.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, { text: promptText }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            bpm: { type: 'NUMBER' },
            sections: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  startTime: { type: 'NUMBER' },
                  endTime: { type: 'NUMBER' },
                  mood: { type: 'STRING' },
                },
              },
            },
            overallMood: { type: 'STRING' },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Audio analysis for video generation failed:', error);
    // Return default analysis if AI analysis fails
    return {
      bpm: 120,
      sections: [{ name: 'full', startTime: 0, endTime: 60, mood: 'neutral' }],
      overallMood: 'neutral',
    };
  }
};

/**
 * Generate multiple related visual scenes based on the theme and audio analysis
 */
const generateMultipleVisualScenes = async (
  prompt: string,
  style: Style,
  audioAnalysis: any
): Promise<string[]> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    // Create a prompt that considers the audio analysis
    const scenePrompts = audioAnalysis.sections.map((section: any, index: number) => {
      return `Create a visually stunning image for a ${style} style music video. Theme: "${prompt}". This image represents the "${section.name}" section with a "${section.mood}" mood. The visual should match the energy level of this section. Scene ${index + 1} of ${audioAnalysis.sections.length}.`;
    });

    // Generate images for each section
    const imageUrls: string[] = [];
    
    for (let i = 0; i < scenePrompts.length; i++) {
      const promptText = scenePrompts[i];
      
      // Generate one image at a time to avoid rate limits
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: promptText,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  } catch (error) {
    console.error('Visual scene generation failed:', error);
    throw error;
  }
};

const base64ToGenerativePart = async (base64: string, mimeType: string) => {
  return {
    inlineData: { data: base64.split(',')[1], mimeType },
  };
};

/**
 * Create a video from the generated scenes and synchronized with audio
 */
const createVideoFromScenesAndAudio = async (
  imageUrls: string[],
  audioFile: File,
  audioAnalysis: any,
  style: Style,
  resolution: Resolution
): Promise<Blob> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    // Create a detailed prompt for video generation that includes audio synchronization
    const resolutionText = resolution === '1080p' ? 'Full HD 1080p' : 'HD 720p';
    const promptText = `Create a ${style} style, ${resolutionText} resolution music video using these visual scenes as reference. The video should be synchronized to the provided audio with scene transitions matching the beat and musical sections. The overall mood should match "${audioAnalysis.overallMood}". Visuals should be dynamic and flow smoothly between scenes. BPM is ${audioAnalysis.bpm}.`;

    const imageParts = await Promise.all(imageUrls.map(url => base64ToGenerativePart(url, 'image/png')));
    const audioPart = await fileToGenerativePart(audioFile);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-001',
      prompt: promptText,
      image: imageParts,
      audio: audioPart,
      config: {
        numberOfVideos: 1,
      },
    });

    // Poll for the result
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
      throw new Error('Video generation failed or returned no URI.');
    }

    const downloadLink = operation.response.generatedVideos[0].video.uri;
    const videoResponse = await fetch(
      `${downloadLink}&key=${process.env.API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }
    return await videoResponse.blob();
  } catch (error) {
    console.error('Video creation from scenes and audio failed:', error);
    throw error;
  }
};

/**
 * Generate a sequence of related images for animation
 */
export const generateImageSequenceForAnimation = async (
  prompt: string,
  style: Style,
  count: number = 8
): Promise<string[]> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    // Generate multiple related images that can be used for animation
    const imageUrls: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const imagePrompt = `Create image ${i + 1} of ${count} in a sequence for a ${style} style animation. Theme: "${prompt}". Each image should flow smoothly to the next, creating a cohesive visual story. The scene should show progression or subtle changes from the previous image.`;
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  } catch (error) {
    console.error('Image sequence generation failed:', error);
    throw error;
  }
};

/**
 * Create a simple animation from an image sequence using video generation
 */
export const createAnimationFromImageSequence = async (
  imageUrls: string[],
  audioFile: File | null,
  style: Style,
  resolution: Resolution
): Promise<Blob> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }

  try {
    const resolutionText = resolution === '1080p' ? 'Full HD 1080p' : 'HD 720p';
    let promptText = `Create a ${style} style, ${resolutionText} resolution video animation from sequential images. The animation should smoothly transition between each image in the sequence, creating a cohesive visual flow. The movement should be subtle and artistic.`;
    
    if (audioFile) {
      promptText += ` Synchronize the animation transitions with the provided audio track.`;
    }

    const imageParts = await Promise.all(imageUrls.map(url => base64ToGenerativePart(url, 'image/png')));
    const audioPart = audioFile ? await fileToGenerativePart(audioFile) : undefined;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-001',
      prompt: promptText,
      image: imageParts,
      audio: audioPart,
      config: {
        numberOfVideos: 1,
      },
    });

    // Poll for the result
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
      throw new Error('Animation generation failed or returned no URI.');
    }

    const downloadLink = operation.response.generatedVideos[0].video.uri;
    const videoResponse = await fetch(
      `${downloadLink}&key=${process.env.API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch animation: ${videoResponse.statusText}`);
    }
    return await videoResponse.blob();
  } catch (error) {
    console.error('Animation creation from image sequence failed:', error);
    throw error;
  }
};