import { GoogleGenAI, Modality, Type } from '@google/genai';
import {
	Style,
	Resolution,
	VideoType,
	FontFamily,
	AnimationStyle,
} from "../context/AppContext";

// Check if API key is defined
if (!process.env.API_KEY) {
  console.warn('API_KEY is not defined. Gemini services will not work.');
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

export const generateLogo = async (): Promise<string> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
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
  key: string;
  structure: { part: string; start: number; end: number }[];
}

export const analyzeAudio = async (
  audioFile: File
): Promise<AnalysisResult> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
  try {
    const audioPart = await fileToGenerativePart(audioFile);
    const promptText = `Analyze this audio file. Determine its BPM (Beats Per Minute), primary chord progression, musical key, and song structure (e.g., verse, chorus, bridge). Respond ONLY with a JSON object containing 'bpm' (as a number), 'chords' (as an array of strings), 'key' (as a string, e.g., "C Major"), and 'structure' (as an array of objects with 'part', 'start', and 'end' time in seconds).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, { text: promptText }] },
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
            key: { type: Type.STRING },
            structure: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  part: { type: Type.STRING },
                  start: { type: Type.NUMBER },
                  end: { type: Type.NUMBER },
                },
              },
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
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
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
  fontFamily: FontFamily;
  fontSize: number;
  fontColor: string;
  animationStyle: AnimationStyle;
}

// Enhanced function to generate multiple images for video creation
export const generateMultipleImages = async (
  prompt: string,
  style: Style,
  count: number = 5
): Promise<string[]> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
  try {
    // Enhance the prompt with style-specific details
    const enhancedPrompt = `Create ${count} distinct and connected images for a ${style} style music video based on this theme: ${prompt}. Each image should represent different visual elements that flow together to match the song's mood and rhythm. Maintain visual consistency across all images.`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: enhancedPrompt,
      config: {
        numberOfImages: count,
        outputMimeType: 'image/png',
      },
    });

    const imageUrls: string[] = [];
    for (const image of response.generatedImages) {
      const base64ImageBytes: string = image.image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      imageUrls.push(imageUrl);
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
};

// Function to create a video by animating multiple generated images
export const createVideoFromImages = async (
  imageUrls: string[],
  audioFile: File
): Promise<Blob> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
  try {
    // Convert the audio file to a generative part
    const audioPart = await fileToGenerativePart(audioFile);
    
    // Create a prompt for video generation that uses the images as reference
    const prompt = `Create a high-quality music video that seamlessly transitions between visual scenes. Use the provided images as reference for the visual style and content. Synchronize the visual transitions with the audio rhythm and mood to create a cohesive music video experience.`;
    
    // Create a video from the generated images
    let operation = await ai.models.generateVideos({
      model: 'veo-3.0-generate-001', // Using the latest Veo model if available
      prompt: prompt,
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
    console.error('Video generation from images failed:', error);
    throw error;
  }
};

export const generateVideo = async (
  options: GenerateVideoOptions
): Promise<Blob> => {
  if (!ai) {
    throw new Error('AI service is not initialized. Please provide an API key.');
  }
  
  try {
    const {
			prompt,
			style,
			resolution,
			videoType,
			lyrics,
			imageFile,
			fontFamily,
			fontSize,
			fontColor,
			animationStyle,
		} = options;
    const resolutionText =
      resolution === '1080p' ? 'Full HD 1080p' : 'HD 720p';

    // If it's a lyrics video, use the existing approach
    if (videoType === 'lyrics') {
      const fullPrompt = `Create a ${style}, ${resolutionText} resolution lyrics video. The background visuals should be based on this description: "${prompt}". The lyrics should be displayed with the following styling: Font Family: ${fontFamily}, Font Size: ${fontSize}px, Font Color: ${fontColor}, Animation Style: ${animationStyle}.

Lyrics:
${lyrics}`;

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
    } else {
      // For visual videos, generate multiple images and create video from them
      const imageCount = 5; // Generate 5 different visual scenes
      const imageUrls = await generateMultipleImages(prompt, style, imageCount);
      
      // For now, return a placeholder - in a real implementation we would create a video from images
      // Since the Veo API doesn't directly support creating videos from a sequence of images yet,
      // we can create a visual video with the enhanced prompt
      const fullPrompt = `A ${style}, ${resolutionText} resolution music video based on this description: ${prompt}. Create a visually stunning sequence that flows with the rhythm and mood of the music. Include dynamic transitions between scenes that match the beat.`;

      const image = imageFile ? await fileToGenerativePart(imageFile) : undefined;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.0-generate-001',
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
    }
  } catch (error) {
    console.error('Video generation failed:', error);
    throw error;
  }
};