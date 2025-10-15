import React from "react";
import {
	useAppContext,
	FontFamily,
	AnimationStyle,
} from "../context/AppContext";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const LyricEditor: React.FC = () => {
	const {
		fontFamily,
		setFontFamily,
		fontSize,
		setFontSize,
		fontColor,
		setFontColor,
		animationStyle,
		setAnimationStyle,
	} = useAppContext();

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Lyric Style</h3>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor="font-family">Font Family</Label>
					<Select
						value={fontFamily}
						onValueChange={(value) => setFontFamily(value as FontFamily)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a font" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Arial">Arial</SelectItem>
							<SelectItem value="Times New Roman">Times New Roman</SelectItem>
							<SelectItem value="Courier New">Courier New</SelectItem>
							<SelectItem value="Georgia">Georgia</SelectItem>
							<SelectItem value="Verdana">Verdana</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label htmlFor="font-size">Font Size</Label>
					<Input
						id="font-size"
						type="number"
						value={fontSize}
						onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
						placeholder="e.g., 24"
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="font-color">Font Color</Label>
					<Input
						id="font-color"
						type="text"
						value={fontColor}
						onChange={(e) => setFontColor(e.target.value)}
						placeholder="e.g., #FFFFFF"
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="animation-style">Animation Style</Label>
					<Select
						value={animationStyle}
						onValueChange={(value) => setAnimationStyle(value as AnimationStyle)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select an animation" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="fade">Fade</SelectItem>
							<SelectItem value="karaoke">Karaoke</SelectItem>
							<SelectItem value="pop-up">Pop-up</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};

export default LyricEditor;
