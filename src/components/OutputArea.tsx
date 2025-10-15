import React from 'react';
import { useAppContext } from '../context/AppContext';

const OutputArea: React.FC = () => {
  const {
    isGenerating,
    error,
    generatedImageUrl,
    generatedVideoUrl,
  } = useAppContext();

  // Only show content if we have actual generated content, not just any error
  const hasContent = generatedImageUrl || generatedVideoUrl;
  const hasRelevantError = error && !error.includes('logo'); // Ignore logo errors

  return (
    <div id="output-area" className={`output-area ${hasContent ? 'has-content' : ''}`}>
      {isGenerating && (
        <div id="loader" className="loader">
          <div className="spinner"></div>
          <p id="loading-message">Generating your amazing visuals...</p>
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
            <a
              id="download-image-btn"
              className="secondary-action"
              href={generatedImageUrl}
              download="ai-edited-image.png"
            >
              <i className="fa-solid fa-download"></i> Download Image
            </a>
          </div>
        </div>
      )}

      {generatedVideoUrl && (
        <div id="video-result" className="video-result">
          <video id="video-player" src={generatedVideoUrl} controls></video>
          <div className="video-actions">
            <a
              id="download-video-btn"
              className="secondary-action"
              href={generatedVideoUrl}
              download="ai-music-video.mp4"
            >
              <i className="fa-solid fa-download"></i> Download Video
            </a>
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
