import React from 'react';
import {
  useAppContext,
  Style,
  Resolution,
  VideoType,
} from '../context/AppContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, RadioGroup, RadioGroupItem } from './ui';

const CreateVisualsSection: React.FC = () => {
  const {
    prompt,
    setPrompt,
    style,
    setStyle,
    resolution,
    setResolution,
    videoType,
    setVideoType,
    lyrics,
    setLyrics,
  } = useAppContext();

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
            3
          </span>
          Create Your Visuals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Visual Template (Optional)</Label>
          <div id="template-gallery" className="template-gallery">
            {/* Templates will be dynamically inserted here by TS */}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="prompt-input" className="flex items-center gap-2">
            <i className="fa-solid fa-palette"></i>
            Describe Your Visuals
          </Label>
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

        <div className="space-y-3">
          <Label htmlFor="style-select" className="flex items-center gap-2">
            <i className="fa-solid fa-palette"></i>
            Visual Style
          </Label>
          <div className="style-grid">
            {[
              { value: 'cinematic', label: 'Cinematic', icon: 'fa-film', description: 'Hollywood-style visuals' },
              { value: 'street-art-graffiti', label: 'Street Art', icon: 'fa-spray-can', description: 'Urban graffiti style' },
              { value: '90s-vhs-camcorder', label: '90s VHS', icon: 'fa-video', description: 'Retro camcorder look' },
              { value: 'gold-and-bling', label: 'Gold & Bling', icon: 'fa-gem', description: 'Luxury and shine' },
              { value: 'vintage-film', label: 'Vintage Film', icon: 'fa-camera-retro', description: 'Classic film aesthetic' },
              { value: 'animated-doodles', label: 'Animated', icon: 'fa-pencil', description: 'Hand-drawn animation' },
              { value: 'surreal', label: 'Surreal', icon: 'fa-eye', description: 'Dreamlike imagery' },
              { value: 'anime', label: 'Anime', icon: 'fa-star', description: 'Japanese animation style' }
            ].map((styleOption) => (
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

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <i className="fa-solid fa-tv"></i>
            Video Resolution
          </Label>
          <div className="resolution-grid">
            {[
              { value: '720p', label: '720p', subtitle: 'HD Quality', description: 'Standard definition', icon: 'fa-tv' },
              { value: '1080p', label: '1080p', subtitle: 'Full HD', description: 'High definition', icon: 'fa-tv' }
            ].map((res) => (
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

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <i className="fa-solid fa-video"></i>
            Video Type
          </Label>
          <div className="video-type-grid">
            {[
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
            ].map((type) => (
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

        {videoType === 'lyrics' && (
          <div className="space-y-1">
            <Label htmlFor="lyrics-input">Lyrics</Label>
            <Textarea
              id="lyrics-input"
              placeholder="Paste your song lyrics here..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateVisualsSection;
