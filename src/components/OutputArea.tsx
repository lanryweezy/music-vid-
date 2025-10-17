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

  // Only show content if we have actual generated content, not just any error
  const hasContent = generatedImageUrl || generatedVideoUrl;
  const hasRelevantError = error && !error.includes('logo'); // Ignore logo errors

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
    <div id="output-area" className={`output-area ${hasContent ? 'has-content' : ''}`}>
      {isGenerating && (
        <div id="loader" className="loader">
          <div className="spinner"></div>
          <p id="loading-message">{loadingMessage}</p>
        </div>
      )}

      {!isGenerating && !generatedImageUrl && !generatedVideoUrl && !hasRelevantError && (
        <div id="output-placeholder" className="output-placeholder">
          <div className="video-player-placeholder">
            <div className="video-player-frame">
              <div className="video-player-screen">
                <div className="play-button-overlay">
                  <i className="fa-solid fa-play"></i>
                </div>
                <div className="video-player-controls">
                  <div className="progress-bar-placeholder"></div>
                  <div className="control-buttons">
                    <i className="fa-solid fa-play"></i>
                    <i className="fa-solid fa-volume-high"></i>
                    <i className="fa-solid fa-expand"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="placeholder-content">
            <h3>Ready to Create Magic?</h3>
            <p>Upload your audio file and describe your vision to generate stunning visuals</p>
            <div className="placeholder-features">
              <div className="feature-item">
                <i className="fa-solid fa-music"></i>
                <span>Audio Analysis</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-palette"></i>
                <span>AI Visuals</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-download"></i>
                <span>HD Download</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasRelevantError && (
        <div className="error-container">
          <i className="fa-solid fa-exclamation-triangle error-icon"></i>
          <p className="error">{error}</p>
        </div>
      )}

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