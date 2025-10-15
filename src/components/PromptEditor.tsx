import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Textarea } from './ui/textarea';

export const PromptEditor: React.FC = () => {
  const { prompt, setPrompt } = useAppContext();

  const addToPrompt = (text: string) => {
    const newPrompt = prompt ? `${prompt}, ${text}` : text;
    setPrompt(newPrompt);
  };

  const styleSuggestions = [
    { icon: 'fa-paintbrush', label: 'Style', suggestions: ['cinematic', 'artistic', 'minimalist', 'vintage'] },
    { icon: 'fa-heart', label: 'Mood', suggestions: ['energetic', 'melancholic', 'mysterious', 'uplifting'] },
    { icon: 'fa-sun', label: 'Lighting', suggestions: ['golden hour', 'neon lights', 'soft lighting', 'dramatic shadows'] },
    { icon: 'fa-fill-drip', label: 'Colors', suggestions: ['vibrant colors', 'monochrome', 'pastel tones', 'dark palette'] }
  ];

  return (
    <div className="space-y-2">
      <label htmlFor="prompt-input" className="flex items-center gap-2 text-sm font-medium">
        <i className="fa-solid fa-palette"></i>
        Describe Your Visuals
      </label>
      
      <div className="prompt-editor-container">
        <div className="prompt-toolbar">
          {styleSuggestions.map((category, index) => (
            <div key={index} className="prompt-toolbar-group">
              <button
                type="button"
                className="prompt-toolbar-btn"
                title={`Add ${category.label.toLowerCase()}`}
                onClick={() => {
                  const randomSuggestion = category.suggestions[Math.floor(Math.random() * category.suggestions.length)];
                  addToPrompt(randomSuggestion);
                }}
              >
                <i className={`fa-solid ${category.icon}`}></i>
              </button>
              <div className="prompt-suggestions">
                {category.suggestions.map((suggestion, suggestionIndex) => (
                  <button
                    key={suggestionIndex}
                    type="button"
                    className="prompt-suggestion"
                    onClick={() => addToPrompt(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="prompt-textarea-wrapper">
          <Textarea
            id="prompt-input"
            placeholder="Describe the visuals you want, e.g., 'city at night, neon colors, cinematic lighting, graffiti on walls...'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="enhanced-textarea"
          />
          {prompt && (
            <button
              type="button"
              id="clear-prompt-btn"
              onClick={() => setPrompt('')}
              title="Clear prompt"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        
        <div className="prompt-counter">
          <span className={prompt.length > 800 ? 'text-warning' : 'text-muted-foreground'}>
            {prompt.length} / 1000 characters
          </span>
        </div>
      </div>
    </div>
  );
};
