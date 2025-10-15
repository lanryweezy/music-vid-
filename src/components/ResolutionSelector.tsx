import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { Resolution } from '../context/AppContext';

export const ResolutionSelector: React.FC = () => {
  const { resolution, setResolution } = useAppState();

  const resolutionOptions = [
    { value: '720p', label: '720p', subtitle: 'HD Quality', description: 'Standard definition', icon: 'fa-tv' },
    { value: '1080p', label: '1080p', subtitle: 'Full HD', description: 'High definition', icon: 'fa-tv' }
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <i className="fa-solid fa-tv"></i>
        Video Resolution
      </label>
      <div className="resolution-grid">
        {resolutionOptions.map((res) => (
          <button
            key={res.value}
            type="button"
            className={`resolution-option ${resolution === res.value ? 'selected' : ''}`}
            onClick={() => setResolution(res.value as Resolution)}
          >
            <div className="resolution-icon">
              <i className={`fa-solid ${res.icon}`}></i>
            </div>
            <div className="resolution-info">
              <span className="resolution-label">{res.label}</span>
              <span className="resolution-subtitle">{res.subtitle}</span>
              <span className="resolution-description">{res.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
