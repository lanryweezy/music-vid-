import React from 'react';
import {
  useAppContext,
  Style,
  Resolution,
  VideoType,
} from '../context/AppContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    setShowLyricEditor,
  } = useAppContext();

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
          <Label htmlFor="prompt-input">Describe The Visuals Yourself</Label>
          <Textarea
            id="prompt-input"
            placeholder="e.g., Add graffiti to the walls, or create a classic lowrider scene..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {prompt.length} / 1000
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="style-select">Visual Style</Label>
          <Select value={style} onValueChange={(value) => setStyle(value as Style)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cinematic">Cinematic</SelectItem>
              <SelectItem value="street-art-graffiti">
                Street Art Graffiti
              </SelectItem>
              <SelectItem value="90s-vhs-camcorder">
                90s VHS Camcorder
              </SelectItem>
              <SelectItem value="gold-and-bling">Gold & Bling</SelectItem>
              <SelectItem value="vintage-film">Vintage Film</SelectItem>
              <SelectItem value="animated-doodles">Animated Doodles</SelectItem>
              <SelectItem value="surreal">Surreal</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Video Resolution</Label>
          <RadioGroup
            value={resolution}
            onValueChange={(value) => setResolution(value as Resolution)}
            className="flex"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="720p" id="r1" />
              <Label htmlFor="r1">720p (HD)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1080p" id="r2" />
              <Label htmlFor="r2">1080p (FHD)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1">
          <Label>Video Type</Label>
          <RadioGroup
            value={videoType}
            onValueChange={(value) => setVideoType(value as VideoType)}
            className="flex"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visual" id="r3" />
              <Label htmlFor="r3">Visual Video</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lyrics" id="r4" />
              <Label htmlFor="r4">Lyrics Video</Label>
            </div>
          </RadioGroup>
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
            <Button onClick={() => setShowLyricEditor(true)} className="mt-2">
              Edit Lyric Timing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateVisualsSection;
