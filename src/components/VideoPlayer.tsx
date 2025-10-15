import React from 'react';

export const VideoPlayer = {
  Placeholder: () => (
    <div className="output-placeholder">
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
  ),

  ImageResult: ({ url }: { url: string }) => (
    <div className="image-result">
      <img src={url} alt="Generated image" className="generated-image" />
      <div className="video-actions">
        <a
          href={url}
          download="ai-edited-image.png"
          className="secondary-action"
        >
          <i className="fa-solid fa-download"></i> Download Image
        </a>
      </div>
    </div>
  ),

  VideoResult: ({ url }: { url: string }) => (
    <div className="video-result">
      <video src={url} controls className="generated-video"></video>
      <div className="video-actions">
        <a
          href={url}
          download="ai-music-video.mp4"
          className="secondary-action"
        >
          <i className="fa-solid fa-download"></i> Download Video
        </a>
        <p className="download-note">
          Note: The downloaded video will be silent. You can combine it
          with your audio using any video editing software.
        </p>
      </div>
    </div>
  ),
};
