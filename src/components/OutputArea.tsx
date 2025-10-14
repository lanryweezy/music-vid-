import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ShareModal from "./ShareModal";

const OutputArea: React.FC = () => {
	const {
		isGenerating,
		error,
		generatedImageUrl,
		generatedVideoUrl,
		loadingMessage,
	} = useAppContext();

	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	const handleDownload = (url: string, filename: string) => {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const shareUrl = generatedVideoUrl || generatedImageUrl || "";

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
						<button
							className="secondary-action"
							onClick={() => setIsShareModalOpen(true)}
						>
							<i className="fa-solid fa-share"></i> Share
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
						<button
							className="secondary-action"
							onClick={() => setIsShareModalOpen(true)}
						>
							<i className="fa-solid fa-share"></i> Share
						</button>
						<p className="download-note">
							Note: The downloaded video will be silent. You can combine it
							with your audio using any video editing software.
						</p>
					</div>
				</div>
			)}

			{isShareModalOpen && (
				<ShareModal url={shareUrl} onClose={() => setIsShareModalOpen(false)} />
			)}
		</div>
	);
};

export default OutputArea;
