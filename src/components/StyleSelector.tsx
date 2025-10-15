import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Style } from '../context/AppContext';

export const StyleSelector: React.FC = () => {
  const { style, setStyle } = useAppState();

  const styleOptions = [
    { value: 'cinematic', label: 'Cinematic', icon: 'fa-film', description: 'Hollywood-style visuals' },
    { value: 'street-art-graffiti', label: 'Street Art', icon: 'fa-spray-can', description: 'Urban graffiti style' },
    { value: '90s-vhs-camcorder', label: '90s VHS', icon: 'fa-video', description: 'Retro camcorder look' },
    { value: 'gold-and-bling', label: 'Gold & Bling', icon: 'fa-gem', description: 'Luxury and shine' },
    { value: 'vintage-film', label: 'Vintage Film', icon: 'fa-camera-retro', description: 'Classic film aesthetic' },
    { value: 'animated-doodles', label: 'Animated', icon: 'fa-pencil', description: 'Hand-drawn animation' },
    { value: 'surreal', label: 'Surreal', icon: 'fa-eye', description: 'Dreamlike imagery' },
    { value: 'anime', label: 'Anime', icon: 'fa-star', description: 'Japanese animation style' }
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <i className="fa-solid fa-palette"></i>
        Visual Style
      </label>
      <div className="style-grid">
        {styleOptions.map((styleOption) => (
          <button
            key={styleOption.value}
            type="button"
            className={`style-option ${style === styleOption.value ? 'selected' : ''}`}
            onClick={() => setStyle(styleOption.value as Style)}
          >
            <div className="style-icon">
              <i className={`fa-solid ${styleOption.icon}`}></i>
            </div>
            <div className="style-info">
              <span className="style-label">{styleOption.label}</span>
              <span className="style-description">{styleOption.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
