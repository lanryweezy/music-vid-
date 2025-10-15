import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { VideoType } from '../context/AppContext';

export const VideoTypeSelector: React.FC = () => {
  const { videoType, setVideoType } = useAppState();

  const videoTypeOptions = [
    {
      value: 'visual',
      label: 'Visual Video',
      subtitle: 'AI-Generated Visuals',
      description: 'Create stunning visuals that sync with your audio',
      icon: 'fa-magic-wand-sparkles'
    },
    {
      value: 'lyrics',
      label: 'Lyrics Video',
      subtitle: 'Text-Based Video',
      description: 'Display lyrics with beautiful typography and effects',
      icon: 'fa-font'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <i className="fa-solid fa-video"></i>
        Video Type
      </label>
      <div className="video-type-grid">
        {videoTypeOptions.map((type) => (
          <button
            key={type.value}
            type="button"
            className={`video-type-option ${videoType === type.value ? 'selected' : ''}`}
            onClick={() => setVideoType(type.value as VideoType)}
          >
            <div className="video-type-icon">
              <i className={`fa-solid ${type.icon}`}></i>
            </div>
            <div className="video-type-info">
              <span className="video-type-label">{type.label}</span>
              <span className="video-type-subtitle">{type.subtitle}</span>
              <span className="video-type-description">{type.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
