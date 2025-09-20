import { GoogleGenAI, Modality, Type } from '@google/genai';
import { Style, Resolution, VideoType } from '../context/AppContext';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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

export const generateLogo = async (): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A modern, minimalist logo for a music video generator app called 'AI Music Video Generator'.
               It should elegantly combine a musical note or play button icon with a subtle AI-related element like a neural network pattern or a stylized brain/chip.
               The logo must be a clean, vector-style graphic suitable for a tech application header.
               Use a vibrant color palette with gold and electric blue accents on a transparent background.
               The logo should be enclosed in a circle.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png', // Use PNG for transparency
      },
    });

    const base64ImageBytes: string =
      response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    return imageUrl;
  } catch (error) {
    console.error('Failed to generate logo:', error);
    throw error;
  }
};

export interface AnalysisResult {
  bpm: number;
  chords: string[];
}

export const analyzeAudio = async (
  audioFile: File
): Promise<AnalysisResult> => {
  try {
    const audioPart = await fileToGenerativePart(audioFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, { text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bpm: { type: Type.NUMBER },
            chords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error('Audio analysis failed:', error);
    throw error;
  }
};

export const editImage = async (
  imageFile: File,
  prompt: string
): Promise<Blob> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        const fetchResponse = await fetch(imageUrl);
        return await fetchResponse.blob();
      }
    }
    throw new Error('Image editing failed. The model did not return an image.');
  } catch (error) {
    console.error('Image editing failed:', error);
    throw error;
  }
};

export interface GenerateVideoOptions {
  prompt: string;
  style: Style;
  resolution: Resolution;
  videoType: VideoType;
  lyrics: string;
  imageFile?: File;
}

export const generateVideo = async (
  options: GenerateVideoOptions
): Promise<Blob> => {
  try {
    const { prompt, style, resolution, videoType, lyrics, imageFile } = options;
    const resolutionText =
      resolution === '1080p' ? 'Full HD 1080p' : 'HD 720p';

    let fullPrompt = '';
    if (videoType === 'lyrics') {
      fullPrompt = `Create a ${style}, ${resolutionText} resolution lyrics video with animated text for the following lyrics. The background visuals should be based on this description: "${prompt}".\n\nLyrics:\n${lyrics}`;
    } else {
      fullPrompt = `A ${style}, ${resolutionText} resolution music video of ${prompt}`;
    }

    const image = imageFile ? await fileToGenerativePart(imageFile) : undefined;

    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: fullPrompt,
      ...(image && {
        image: {
          imageBytes: image.inlineData.data,
          mimeType: image.inlineData.mimeType,
        },
      }),
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
    console.error('Video generation failed:', error);
    throw error;
  }
};
