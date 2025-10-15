import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/button';

export const AdvancedMusicVideoSection: React.FC = () => {
  const { 
    generateAdvancedMusicVideo, 
    isGeneratingAdvanced, 
    loadingMessage,
    error 
  } = useAppContext();
  
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  return (
    <div className="advanced-music-video-section p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Advanced Music Video Generation</h2>
        <Button 
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          variant="outline"
          className="text-sm"
        >
          {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
        </Button>
      </div>
      
      <p className="text-gray-600 mb-4">
        Our advanced AI analyzes your music to create a perfectly synchronized video with dynamic visuals that match the rhythm, mood, and structure of your song.
      </p>
      
      {showAdvancedOptions && (
        <div className="advanced-options mb-4 p-4 bg-white rounded border border-gray-200">
          <h3 className="font-semibold mb-2">Advanced Settings</h3>
          <p className="text-sm text-gray-500">
            These options will be available in the advanced editor: 
            - Frame rate selection
            - Visual complexity level
            - Transition style customization
          </p>
        </div>
      )}
      
      <Button 
        onClick={generateAdvancedMusicVideo}
        disabled={isGeneratingAdvanced}
        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
      >
        {isGeneratingAdvanced ? 'Creating Advanced Music Video...' : 'Generate Advanced Music Video'}
      </Button>
      
      {isGeneratingAdvanced && (
        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-800 font-medium">Processing: {loadingMessage}</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};