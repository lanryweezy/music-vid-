import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
} from "react";
import {
	generateLogo,
	analyzeAudio,
	AnalysisResult,
	editImage,
	generateVideo,
} from "../services/gemini";
import {
	generateAdvancedMusicVideo,
	generateImageSequenceForAnimation,
	createAnimationFromImageSequence
} from "../services/musicVideoGenerator";

export type Style =
	| "cinematic"
	| "street-art-graffiti"
	| "90s-vhs-camcorder"
	| "gold-and-bling"
	| "vintage-film"
	| "animated-doodles"
	| "surreal"
	| "anime";

export type Resolution = "720p" | "1080p";
export type VideoType = "visual" | "lyrics";
export type FontFamily =
	| "Arial"
	| "Times New Roman"
	| "Courier New"
	| "Georgia"
	| "Verdana";
export type AnimationStyle = "fade" | "karaoke" | "pop-up";

export interface VisualTemplate {
	name: string;
	prompt: string;
	style: Style;
	icon: string;
}

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
	visualTemplates: VisualTemplate[];
	handleTemplateSelect: (template: VisualTemplate) => void;
	isMetronomePlaying: boolean;
	toggleMetronome: () => void;
	metronomeBpm: number;
	setMetronomeBpm: (bpm: number) => void;
	loadingMessage: string;
	fontFamily: FontFamily;
	setFontFamily: (family: FontFamily) => void;
	fontSize: number;
	setFontSize: (size: number) => void;
	fontColor: string;
	setFontColor: (color: string) => void;
	animationStyle: AnimationStyle;
	setAnimationStyle: (style: AnimationStyle) => void;
	// New advanced features
	generateAdvancedMusicVideo: () => void;
	isGeneratingAdvanced: boolean;
}

// Create the context
const AppContext = createContext<IAppContext | undefined>(undefined);

const visualTemplates: VisualTemplate[] = [
	{
		name: "Neon Drive",
		prompt:
			"A retro-futuristic drive through a neon-lit city at night, with rain-slicked streets reflecting the glowing signs. The style is synthwave, with a vintage 80s aesthetic. Lens flares and light trails are prominent.",
		style: "cinematic",
		icon: "fa-road",
	},
	{
		name: "Vintage Memories",
		prompt:
			"A nostalgic and grainy video montage, resembling old Super 8 film footage. It features sun-drenched, overexposed shots of summer days, candid moments, and a warm, faded color palette. Add light leaks and film scratches for an authentic feel.",
		style: "vintage-film",
		icon: "fa-camera-retro",
	},
	{
		name: "Cosmic Dream",
		prompt:
			"A surreal journey through space, with swirling nebulae, glowing galaxies, and abstract cosmic patterns. The visuals are ethereal and dreamlike, with slow, floating camera movements. Colors are vibrant purples, pinks, and deep blues.",
		style: "surreal",
		icon: "fa-meteor",
	},
	{
		name: "Graffiti Jam",
		prompt:
			"A high-energy, urban scene with dynamic, animated graffiti art coming to life on brick walls. The style is gritty and raw, with fast cuts and stop-motion effects. The color palette is bold and vibrant, like fresh spray paint.",
		style: "street-art-graffiti",
		icon: "fa-spray-can",
	},
];

const loadingMessages = [
	"Warming up the cameras...",
	"Syncing the visuals to the beat...",
	"Composing the first shot...",
	"Applying stylistic filters...",
	"Rendering the scene...",
	"Animating the lyrics...",
	"Editing the sequence...",
	"Polishing the final cut...",
	"Almost there, the masterpiece is coming!",
];

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
	const [prompt, setPrompt] = useState("");
	const [style, setStyle] = useState<Style>("cinematic");
	const [resolution, setResolution] = useState<Resolution>("720p");
	const [videoType, setVideoType] = useState<VideoType>("visual");
	const [lyrics, setLyrics] = useState("");
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
	const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
	const [metronomeBpm, setMetronomeBpm] = useState(120);
	const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
	const [fontFamily, setFontFamily] = useState<FontFamily>("Arial");
	const [fontSize, setFontSize] = useState(24);
	const [fontColor, setFontColor] = useState("#FFFFFF");
	const [animationStyle, setAnimationStyle] =
		useState<AnimationStyle>("fade");
	
	// New state for advanced music video generation
	const [isGeneratingAdvanced, setIsGeneratingAdvanced] = useState(false);

  const fetchLogo = useCallback(async () => {
		try {
			const url = await generateLogo();
			setLogoUrl(url);
		} catch (error) {
			console.error("Failed to fetch logo:", error);
			setError("Failed to generate logo.");
		}
	}, []);

	const handleAnalyzeAudio = async () => {
		if (!audioFile) return;
		setIsAnalyzing(true);
		setAnalysisResult(null);
		setError(null);
		try {
			const result = await analyzeAudio(audioFile);
			setAnalysisResult(result);
			setMetronomeBpm(Math.round(result.bpm));
		} catch (error) {
			console.error("Failed to analyze audio:", error);
			setError("Failed to analyze audio.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleGenerate = async () => {
		setIsGenerating(true);
		setError(null);
		setGeneratedImageUrl(null);
		setGeneratedVideoUrl(null);

		const loadingInterval = setInterval(() => {
			setLoadingMessage(
				loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
			);
		}, 2000);

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
					fontFamily,
					fontSize,
					fontColor,
					animationStyle,
				});
				setGeneratedVideoUrl(URL.createObjectURL(blob));
			}
		} catch (error) {
			console.error("Generation failed:", error);
			setError("Generation failed.");
		} finally {
			setIsGenerating(false);
			clearInterval(loadingInterval);
		}
	};

	const handleTemplateSelect = (template: VisualTemplate) => {
		setPrompt(template.prompt);
		setStyle(template.style);
	};

	const toggleMetronome = () => {
		setIsMetronomePlaying(!isMetronomePlaying);
	};

	const handleGenerateAdvancedMusicVideo = async () => {
		if (!audioFile) {
			setError("Please upload an audio file first.");
			return;
		}

		setIsGeneratingAdvanced(true);
		setError(null);
		setGeneratedImageUrl(null);
		setGeneratedVideoUrl(null);

		const loadingInterval = setInterval(() => {
			setLoadingMessage(
				loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
			);
		}, 2000);

		try {
			const videoBlob = await generateAdvancedMusicVideo(
				audioFile,
				prompt,
				style,
				resolution,
				(progress, stage) => {
					setLoadingMessage(`${stage} (${Math.round(progress)}%)`);
				}
			);
			
			setGeneratedVideoUrl(URL.createObjectURL(videoBlob));
		} catch (error) {
			console.error("Advanced music video generation failed:", error);
			setError("Advanced music video generation failed.");
		} finally {
			setIsGeneratingAdvanced(false);
			clearInterval(loadingInterval);
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
		visualTemplates,
		handleTemplateSelect,
		isMetronomePlaying,
		toggleMetronome,
		metronomeBpm,
		setMetronomeBpm,
		loadingMessage,
		fontFamily,
		setFontFamily,
		fontSize,
		setFontSize,
		fontColor,
		setFontColor,
		animationStyle,
		setAnimationStyle,
		// New advanced features
		generateAdvancedMusicVideo: handleGenerateAdvancedMusicVideo,
		isGeneratingAdvanced,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to use the context
export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
