import React, { useState, useEffect, useRef } from "react";
import {
	useAppContext,
	Style,
	Resolution,
	VideoType,
	VisualTemplate,
} from "../context/AppContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AUTOCOMPLETE_KEYWORDS = [
	"4K resolution",
	"8K resolution",
	"hyperrealistic",
	"photorealistic",
	"cinematic lighting",
	"dramatic lighting",
	"soft light",
	"studio lighting",
	"wide-angle shot",
	"close-up shot",
	"macro shot",
	"aerial view",
	"dolly zoom",
	"slow motion",
	"time-lapse",
	"fast-paced editing",
	"vibrant colors",
	"monochrome",
	"sepia tone",
	"saturated colors",
	"minimalist",
	"abstract",
	"surrealism",
	"futuristic",
	"steampunk",
	"epic landscape",
	"dreamlike atmosphere",
	"glowing effect",
	"lens flare",
	"bokeh",
	"grainy texture",
	"handheld camera effect",
	"low-fi",
];

const CreateVisualsSection: React.FC = () => {
	const {
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
		visualTemplates,
		handleTemplateSelect,
	} = useAppContext();

	const [selectedTemplate, setSelectedTemplate] =
		useState<VisualTemplate | null>(null);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
	const promptRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (selectedTemplate && prompt !== selectedTemplate.prompt) {
			setSelectedTemplate(null);
		}
	}, [prompt, selectedTemplate]);

	const onTemplateSelect = (template: VisualTemplate) => {
		handleTemplateSelect(template);
		setSelectedTemplate(template);
	};

	const formatPromptText = (format: "bold" | "italic") => {
		if (!promptRef.current) return;
		const start = promptRef.current.selectionStart;
		const end = promptRef.current.selectionEnd;
		const text = prompt;
		const selectedText = text.substring(start, end);
		const wrapper = format === "bold" ? "**" : "*";
		let formattedText;
		let newCursorPos;
		if (selectedText) {
			formattedText = `${wrapper}${selectedText}${wrapper}`;
			setPrompt(text.substring(0, start) + formattedText + text.substring(end));
			newCursorPos = start + formattedText.length;
		} else {
			formattedText = `${wrapper}${wrapper}`;
			setPrompt(text.substring(0, start) + formattedText + text.substring(end));
			newCursorPos = start + wrapper.length;
		}
		promptRef.current.focus();
		promptRef.current.setSelectionRange(newCursorPos, newCursorPos);
	};

	const clearPrompt = () => {
		setPrompt("");
		promptRef.current?.focus();
	};

	const updateAutocomplete = () => {
		if (!promptRef.current) return;
		const cursorPos = promptRef.current.selectionStart;
		const textUpToCursor = prompt.substring(0, cursorPos);
		const currentWordMatch = textUpToCursor.match(/[\w-]+$/);
		if (!currentWordMatch) {
			setSuggestions([]);
			return;
		}
		const currentWord = currentWordMatch[0].toLowerCase();
		if (currentWord.length < 2) {
			setSuggestions([]);
			return;
		}
		const filteredSuggestions = AUTOCOMPLETE_KEYWORDS.filter((kw) =>
			kw.toLowerCase().startsWith(currentWord)
		);
		setSuggestions(filteredSuggestions);
		setSelectedSuggestionIndex(-1);
	};

	const applySuggestion = (suggestion: string) => {
		if (!promptRef.current) return;
		const cursorPos = promptRef.current.selectionStart;
		const textUpToCursor = prompt.substring(0, cursorPos);
		const currentWordMatch = textUpToCursor.match(/[\w-]+$/);
		if (currentWordMatch) {
			const startIndex = currentWordMatch.index!;
			const before = prompt.substring(0, startIndex);
			const after = prompt.substring(cursorPos);
			setPrompt(before + suggestion + " " + after);
			const newCursorPos = (before + suggestion + " ").length;
			promptRef.current.focus();
			promptRef.current.setSelectionRange(newCursorPos, newCursorPos);
		}
		setSuggestions([]);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (suggestions.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedSuggestionIndex(
					(prev) => (prev - 1 + suggestions.length) % suggestions.length
				);
			} else if (e.key === "Enter" || e.key === "Tab") {
				if (selectedSuggestionIndex > -1) {
					e.preventDefault();
					applySuggestion(suggestions[selectedSuggestionIndex]);
				}
			} else if (e.key === "Escape") {
				setSuggestions([]);
			}
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
						3
					</span>
					Create Your Visuals
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1">
					<Label>Visual Template (Optional)</Label>
					<div id="template-gallery" className="template-gallery">
						{visualTemplates.map((template, index) => (
							<div
								key={index}
								className={`template-card ${
									selectedTemplate?.name === template.name ? "selected" : ""
								}`}
								onClick={() => onTemplateSelect(template)}
							>
								<i className={`fa-solid ${template.icon}`}></i>
								<span>{template.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-1 relative">
					<Label htmlFor="prompt-input">Describe The Visuals Yourself</Label>
					<Textarea
						id="prompt-input"
						ref={promptRef}
						placeholder="e.g., Add graffiti to the walls, or create a classic lowrider scene..."
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value);
							updateAutocomplete();
						}}
						onKeyDown={handleKeyDown}
						onBlur={() => setTimeout(() => setSuggestions([]), 150)}
					/>
					{suggestions.length > 0 && (
						<div className="autocomplete-suggestions">
							{suggestions.map((suggestion, index) => (
								<div
									key={suggestion}
									className={
										index === selectedSuggestionIndex ? "selected" : ""
									}
									onMouseDown={() => applySuggestion(suggestion)}
								>
									{suggestion}
								</div>
							))}
						</div>
					)}
					<div className="flex justify-between items-center">
						<div className="prompt-editor-buttons">
							<Button
								variant="outline"
								size="sm"
								onClick={() => formatPromptText("bold")}
							>
								<i className="fa-solid fa-bold"></i>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => formatPromptText("italic")}
							>
								<i className="fa-solid fa-italic"></i>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearPrompt}
								className={prompt.length === 0 ? "hidden" : ""}
							>
								Clear
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">
							{prompt.length} / 1000
						</p>
					</div>
				</div>

				<div className="space-y-1">
					<Label htmlFor="style-select">Visual Style</Label>
					<Select
						value={style}
						onValueChange={(value) => setStyle(value as Style)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a style" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="cinematic">Cinematic</SelectItem>
							<SelectItem value="street-art-graffiti">
								Street Art Graffiti
							</SelectItem>
							<SelectItem value="90s-vhs-camcorder">
								90s VHS Camcorder
							</SelectItem>
							<SelectItem value="gold-and-bling">Gold & Bling</SelectItem>
							<SelectItem value="vintage-film">Vintage Film</SelectItem>
							<SelectItem value="animated-doodles">
								Animated Doodles
							</SelectItem>
							<SelectItem value="surreal">Surreal</SelectItem>
							<SelectItem value="anime">Anime</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1">
					<Label>Video Resolution</Label>
					<RadioGroup
						value={resolution}
						onValueChange={(value) => setResolution(value as Resolution)}
						className="flex"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="720p" id="r1" />
							<Label htmlFor="r1">720p (HD)</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="1080p" id="r2" />
							<Label htmlFor="r2">1080p (FHD)</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="space-y-1">
					<Label>Video Type</Label>
					<RadioGroup
						value={videoType}
						onValueChange={(value) => setVideoType(value as VideoType)}
						className="flex"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="visual" id="r3" />
							<Label htmlFor="r3">Visual Video</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="lyrics" id="r4" />
							<Label htmlFor="r4">Lyrics Video</Label>
						</div>
					</RadioGroup>
				</div>

				{videoType === "lyrics" && (
					<div className="space-y-1">
						<Label htmlFor="lyrics-input">Lyrics</Label>
						<Textarea
							id="lyrics-input"
							placeholder="Paste your song lyrics here..."
							value={lyrics}
							onChange={(e) => setLyrics(e.target.value)}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CreateVisualsSection;
