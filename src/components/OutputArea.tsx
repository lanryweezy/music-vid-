import React from "react";
import { useAppContext } from "../context/AppContext";

const OutputArea: React.FC = () => {
	const {
		isGenerating,
		error,
		generatedImageUrl,
		generatedVideoUrl,
		loadingMessage,
	} = useAppContext();

	const handleDownload = (url: string, filename: string) => {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div id="output-area" className="output-area">
			{isGenerating && (
				<div id="loader" className="loader">
					<div className="spinner"></div>
					<p id="loading-message">{loadingMessage}</p>
				</div>
			)}

			{!isGenerating && !generatedImageUrl && !generatedVideoUrl && !error && (
				<div id="output-placeholder" className="output-placeholder">
					<div className="placeholder-icon-wrapper">
						<i className="fa-solid fa-clapperboard"></i>
					</div>
					<p>Your generated visuals will appear here.</p>
				</div>
			)}

			{error && <p className="error">{error}</p>}

			{generatedImageUrl && (
				<div id="image-result" className="image-result">
					<img id="image-viewer" src={generatedImageUrl} alt="Generated image" />
					<div className="video-actions">
						<button
							id="download-image-btn"
							className="secondary-action"
							onClick={() =>
								handleDownload(generatedImageUrl, "ai-edited-image.png")
							}
						>
							<i className="fa-solid fa-download"></i> Download Image
						</button>
					</div>
				</div>
			)}

			{generatedVideoUrl && (
				<div id="video-result" className="video-result">
					<video id="video-player" src={generatedVideoUrl} controls></video>
					<div className="video-actions">
						<button
							id="download-video-btn"
							className="secondary-action"
							onClick={() =>
								handleDownload(generatedVideoUrl, "ai-music-video.mp4")
							}
						>
							<i className="fa-solid fa-download"></i> Download Video
						</button>
						<p className="download-note">
							Note: The downloaded video will be silent. You can combine it
							with your audio using any video editing software.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default OutputArea;
