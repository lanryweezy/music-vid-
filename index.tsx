/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, Modality, Type} from '@google/genai';
import {sanitizeHtml} from 'safevalues';
import {setElementInnerHtml} from 'safevalues/dom';

// --- DOM Element References ---
const appLogo = document.getElementById('app-logo') as HTMLImageElement;
const audioUpload = document.getElementById('audio-upload') as HTMLInputElement;
const audioFileName = document.getElementById('audio-file-name') as HTMLSpanElement;
const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
const imagePreviewContainer = document.getElementById('image-preview-container') as HTMLDivElement;
const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
const imageFileName = document.getElementById('image-file-name') as HTMLSpanElement;
const clearImageBtn = document.getElementById('clear-image-btn') as HTMLButtonElement;
const templateGallery = document.getElementById('template-gallery') as HTMLDivElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const styleSelect = document.getElementById('style-select') as HTMLSelectElement;
const resolution720p = document.getElementById('resolution-720p') as HTMLInputElement;
const resolution1080p = document.getElementById('resolution-1080p') as HTMLInputElement;
const videoTypeVisual = document.getElementById('video-type-visual') as HTMLInputElement;
const videoTypeLyrics = document.getElementById('video-type-lyrics') as HTMLInputElement;
const lyricsGroup = document.getElementById('lyrics-group') as HTMLDivElement;
const lyricsInput = document.getElementById('lyrics-input') as HTMLTextAreaElement;
const fontSelect = document.getElementById('font-select') as HTMLSelectElement;
const fontSizeInput = document.getElementById('font-size-input') as HTMLInputElement;
const fontColorInput = document.getElementById('font-color-input') as HTMLInputElement;
const animationSelect = document.getElementById('animation-select') as HTMLSelectElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const outputArea = document.getElementById('output-area') as HTMLDivElement;
const outputPlaceholder = document.getElementById('output-placeholder') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const loadingMessage = document.getElementById('loading-message') as HTMLParagraphElement;
const videoResult = document.getElementById('video-result') as HTMLDivElement;
const videoPlayer = document.getElementById('video-player') as HTMLVideoElement;
const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement;
const downloadVideoBtn = document.getElementById('download-video-btn') as HTMLButtonElement;
const shareVideoBtn = document.getElementById('share-video-btn') as HTMLButtonElement;
const imageResult = document.getElementById('image-result') as HTMLDivElement;
const imageViewer = document.getElementById('image-viewer') as HTMLImageElement;
const downloadImageBtn = document.getElementById('download-image-btn') as HTMLButtonElement;

// Share Modal Elements
const shareModal = document.getElementById('share-modal') as HTMLDivElement;
const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
const shareTwitter = document.getElementById('share-twitter') as HTMLAnchorElement;
const shareFacebook = document.getElementById('share-facebook') as HTMLAnchorElement;
const shareReddit = document.getElementById('share-reddit') as HTMLAnchorElement;
const shareLinkInput = document.getElementById('share-link-input') as HTMLInputElement;
const copyLinkBtn = document.getElementById('copy-link-btn') as HTMLButtonElement;

// Prompt Editor Elements
const promptBoldBtn = document.getElementById('prompt-bold-btn') as HTMLButtonElement;
const promptItalicBtn = document.getElementById('prompt-italic-btn') as HTMLButtonElement;
const clearPromptBtn = document.getElementById('clear-prompt-btn') as HTMLButtonElement;
const promptCounter = document.getElementById('prompt-counter') as HTMLDivElement;
const autocompleteSuggestions = document.getElementById('autocomplete-suggestions') as HTMLDivElement;


// Musician's Toolkit Elements
const analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
const analysisLoader = document.getElementById('analysis-loader') as HTMLDivElement;
const analysisResult = document.getElementById('analysis-result') as HTMLDivElement;
const bpmResult = document.getElementById('bpm-result') as HTMLSpanElement;
const chordsResult = document.getElementById('chords-result') as HTMLSpanElement;
const keyResult = document.getElementById('key-result') as HTMLSpanElement;
const structureResult = document.getElementById('structure-result') as HTMLSpanElement;
const metronomeBpm = document.getElementById('metronome-bpm') as HTMLInputElement;
const metronomeToggle = document.getElementById('metronome-toggle') as HTMLButtonElement;


// --- State Variables ---
let audioFile: File | null = null;
let sourceImageFile: File | null = null;
let generatedVideoBlob: Blob | null = null;
let generatedImageBlob: Blob | null = null;
let loadingInterval: number | null = null;
let selectedSuggestionIndex = -1;

// Metronome state
let isMetronomePlaying = false;
let metronomeInterval: number | null = null;
let audioContext: AudioContext;


// --- Gemini API Initialization ---
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY!});

// --- Constants ---
const visualTemplates = [
  {
    name: 'Neon Drive',
    prompt:
      'A retro-futuristic drive through a neon-lit city at night, with rain-slicked streets reflecting the glowing signs. The style is synthwave, with a vintage 80s aesthetic. Lens flares and light trails are prominent.',
    style: 'cinematic',
    icon: 'fa-road',
  },
  {
    name: 'Vintage Memories',
    prompt:
      'A nostalgic and grainy video montage, resembling old Super 8 film footage. It features sun-drenched, overexposed shots of summer days, candid moments, and a warm, faded color palette. Add light leaks and film scratches for an authentic feel.',
    style: 'vintage-film',
    icon: 'fa-camera-retro',
  },
  {
    name: 'Cosmic Dream',
    prompt:
      'A surreal journey through space, with swirling nebulae, glowing galaxies, and abstract cosmic patterns. The visuals are ethereal and dreamlike, with slow, floating camera movements. Colors are vibrant purples, pinks, and deep blues.',
    style: 'surreal',
    icon: 'fa-meteor',
  },
  {
    name: 'Graffiti Jam',
    prompt:
      'A high-energy, urban scene with dynamic, animated graffiti art coming to life on brick walls. The style is gritty and raw, with fast cuts and stop-motion effects. The color palette is bold and vibrant, like fresh spray paint.',
    style: 'street-art-graffiti',
    icon: 'fa-spray-can',
  },
];

const loadingMessages = [
  'Warming up the cameras...',
  'Syncing the visuals to the beat...',
  'Composing the first shot...',
  'Applying stylistic filters...',
  'Rendering the scene...',
  'Animating the lyrics...',
  'Editing the sequence...',
  'Polishing the final cut...',
  'Almost there, the masterpiece is coming!',
];

const AUTOCOMPLETE_KEYWORDS = [
  '4K resolution', '8K resolution', 'hyperrealistic', 'photorealistic',
  'cinematic lighting', 'dramatic lighting', 'soft light', 'studio lighting',
  'wide-angle shot', 'close-up shot', 'macro shot', 'aerial view',
  'dolly zoom', 'slow motion', 'time-lapse', 'fast-paced editing',
  'vibrant colors', 'monochrome', 'sepia tone', 'saturated colors',
  'minimalist', 'abstract', 'surrealism', 'futuristic', 'steampunk',
  'epic landscape', 'dreamlike atmosphere', 'glowing effect', 'lens flare',
  'bokeh', 'grainy texture', 'handheld camera effect', 'low-fi'
];


// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
  generateLogo();
  populateTemplates();
  updatePromptCounter();
  toggleClearButton();
});
audioUpload.addEventListener('change', handleAudioUpload);
imageUpload.addEventListener('change', handleImageUpload);
clearImageBtn.addEventListener('click', clearImage);
promptInput.addEventListener('input', handlePromptInput);
promptInput.addEventListener('keydown', handleAutocompleteKeydown);
promptInput.addEventListener('blur', () => setTimeout(hideAutocomplete, 150)); // Delay to allow click
clearPromptBtn.addEventListener('click', clearPrompt);
promptBoldBtn.addEventListener('click', () => formatPromptText('bold'));
promptItalicBtn.addEventListener('click', () => formatPromptText('italic'));
autocompleteSuggestions.addEventListener('mousedown', handleSuggestionClick);
templateGallery.addEventListener('click', handleTemplateSelect);
generateBtn.addEventListener('click', handleGenerateClick);
downloadVideoBtn.addEventListener('click', handleVideoDownload);
downloadImageBtn.addEventListener('click', handleImageDownload);
shareVideoBtn.addEventListener('click', handleShareClick);
closeModalBtn.addEventListener('click', () => shareModal.classList.add('hidden'));
copyLinkBtn.addEventListener('click', copyShareLink);
videoPlayer.addEventListener('play', () => audioPlayer.play());
videoPlayer.addEventListener('pause', () => audioPlayer.pause());
videoPlayer.addEventListener('seeking', () => {
  audioPlayer.currentTime = videoPlayer.currentTime;
});
videoTypeVisual.addEventListener('change', handleVideoTypeChange);
videoTypeLyrics.addEventListener('change', handleVideoTypeChange);
analyzeBtn.addEventListener('click', analyzeAudio);
metronomeToggle.addEventListener('click', toggleMetronome);


// --- Functions ---

/**
 * Generates and displays the app logo on page load.
 */
async function generateLogo() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A modern, minimalist logo for a music video generator app called 'AI Music Video Generator'. 
               It should elegantly combine a musical note or play button icon with a subtle AI-related element like a neural network pattern or a stylized brain/chip. 
               The logo must be a clean, vector-style graphic suitable for a tech application header. 
               Use a vibrant color palette with gold and electric blue accents on a transparent background. 
               The logo should be enclosed in a circle.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png', // Use PNG for transparency
      },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    appLogo.src = imageUrl;
  } catch (error) {
    console.error('Failed to generate logo:', error);
    // Optionally, hide the logo element or set a fallback if generation fails
    appLogo.style.display = 'none';
  }
}

/**
 * Populates the visual template gallery.
 */
function populateTemplates() {
  let galleryHtml = '';
  visualTemplates.forEach((template, index) => {
    galleryHtml += `
      <div class="template-card" data-index="${index}">
        <i class="fa-solid ${template.icon}"></i>
        <span>${template.name}</span>
      </div>
    `;
  });
  setElementInnerHtml(templateGallery, sanitizeHtml(galleryHtml));
}

/**
 * Handles clicks within the template gallery.
 */
function handleTemplateSelect(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const card = target.closest('.template-card') as HTMLDivElement | null;

  if (!card) return;

  // Clear previous selection
  clearTemplateSelection();

  // Select new card
  card.classList.add('selected');

  const templateIndex = parseInt(card.dataset.index!, 10);
  const template = visualTemplates[templateIndex];

  if (template) {
    promptInput.value = template.prompt;
    styleSelect.value = template.style;
    handlePromptInput(); // To update counter and button states
  }
}

/**
 * Clears any selected template in the gallery.
 */
function clearTemplateSelection() {
  document
    .querySelectorAll('.template-card')
    .forEach(c => c.classList.remove('selected'));
}

/**
 * Handles toggling the visibility of the lyrics input field.
 */
function handleVideoTypeChange() {
  if (videoTypeLyrics.checked) {
    lyricsGroup.classList.remove('hidden');
  } else {
    lyricsGroup.classList.add('hidden');
  }
  updateGenerateButtonState();
}

/**
 * Handles the audio file upload event.
 */
function handleAudioUpload() {
  if (audioUpload.files && audioUpload.files.length > 0) {
    audioFile = audioUpload.files[0];
    audioFileName.textContent = audioFile.name;
    const audioUrl = URL.createObjectURL(audioFile);
    audioPlayer.src = audioUrl;
    analyzeBtn.disabled = false;
  } else {
    audioFile = null;
    audioFileName.textContent = 'No file selected.';
    audioPlayer.src = '';
    analyzeBtn.disabled = true;
  }
  updateGenerateButtonState();
}

/**
 * Handles the image file upload event.
 */
function handleImageUpload() {
  if (imageUpload.files && imageUpload.files.length > 0) {
    sourceImageFile = imageUpload.files[0];
    imageFileName.textContent = sourceImageFile.name;

    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.src = e.target?.result as string;
      imagePreviewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(sourceImageFile);
  } else {
    clearImage();
  }
  updateGenerateButtonState();
}

/**
 * Clears the selected image file and hides the preview.
 */
function clearImage() {
  sourceImageFile = null;
  imageUpload.value = ''; // Reset file input
  imagePreviewContainer.classList.add('hidden');
  imagePreview.src = '#';
  imageFileName.textContent = '';
  updateGenerateButtonState();
}

/**
 * Updates the main generate button's text and disabled state based on inputs.
 */
function updateGenerateButtonState() {
  const hasAudio = !!audioFile;
  const hasImage = !!sourceImageFile;
  const hasPrompt = promptInput.value.trim().length > 0;

  if (hasImage && !hasAudio) {
    setElementInnerHtml(
      generateBtn,
      sanitizeHtml(`<i class="fa-solid fa-wand-magic-sparkles"></i> Edit Image`)
    );
    generateBtn.disabled = !hasPrompt;
    return;
  }

  if (hasAudio) {
    setElementInnerHtml(
      generateBtn,
      sanitizeHtml(`<i class="fa-solid fa-diamond"></i> Generate Video`)
    );
    generateBtn.disabled = !hasPrompt;
    return;
  }

  // Default state: disabled video generation
  setElementInnerHtml(
    generateBtn,
    sanitizeHtml(`<i class="fa-solid fa-diamond"></i> Generate Video`)
  );
  generateBtn.disabled = true;
}

// --- Prompt Editor Functions ---

/**
 * Main handler for prompt input changes.
 */
function handlePromptInput() {
  updatePromptCounter();
  toggleClearButton();
  updateAutocomplete();
  clearTemplateSelection();
  updateGenerateButtonState();
}

/**
 * Updates the character count display for the prompt textarea.
 */
function updatePromptCounter() {
  const charCount = promptInput.value.length;
  const maxLength = promptInput.maxLength;
  promptCounter.textContent = `${charCount} / ${maxLength}`;
}

/**
 * Shows or hides the 'clear' button based on whether the prompt has content.
 */
function toggleClearButton() {
  clearPromptBtn.classList.toggle('hidden', promptInput.value.length === 0);
}

/**
 * Clears the prompt input and resets related UI elements.
 */
function clearPrompt() {
  promptInput.value = '';
  handlePromptInput();
  promptInput.focus();
}

/**
 * Wraps selected text in the prompt with formatting characters.
 */
function formatPromptText(format: 'bold' | 'italic') {
  const start = promptInput.selectionStart;
  const end = promptInput.selectionEnd;
  const text = promptInput.value;
  const selectedText = text.substring(start, end);
  const wrapper = format === 'bold' ? '**' : '*';

  let formattedText;
  let newCursorPos;

  if (selectedText) {
    // Wrap selected text
    formattedText = `${wrapper}${selectedText}${wrapper}`;
    promptInput.value = text.substring(0, start) + formattedText + text.substring(end);
    newCursorPos = start + formattedText.length;
  } else {
    // Insert wrappers and place cursor in the middle
    formattedText = `${wrapper}${wrapper}`;
    promptInput.value = text.substring(0, start) + formattedText + text.substring(end);
    newCursorPos = start + wrapper.length;
  }

  promptInput.focus();
  promptInput.setSelectionRange(newCursorPos, newCursorPos);
  handlePromptInput();
}


// --- Autocomplete Functions ---

/**
 * Updates and displays autocomplete suggestions based on current input.
 */
function updateAutocomplete() {
  const cursorPos = promptInput.selectionStart;
  const textUpToCursor = promptInput.value.substring(0, cursorPos);
  const currentWordMatch = textUpToCursor.match(/[\w-]+$/);

  if (!currentWordMatch) {
    hideAutocomplete();
    return;
  }

  const currentWord = currentWordMatch[0].toLowerCase();

  if (currentWord.length < 2) {
    hideAutocomplete();
    return;
  }

  const suggestions = AUTOCOMPLETE_KEYWORDS.filter(kw =>
    kw.toLowerCase().startsWith(currentWord)
  );

  if (suggestions.length > 0) {
    showAutocomplete(suggestions);
  } else {
    hideAutocomplete();
  }
}

/**
 * Renders and shows the autocomplete suggestions dropdown.
 */
function showAutocomplete(suggestions: string[]) {
  if (suggestions.length === 0) {
    hideAutocomplete();
    return;
  }

  let suggestionsHtml = '';
  suggestions.forEach(suggestion => {
    suggestionsHtml += `<div data-value="${suggestion}">${suggestion}</div>`;
  });

  setElementInnerHtml(autocompleteSuggestions, sanitizeHtml(suggestionsHtml));
  autocompleteSuggestions.classList.remove('hidden');
  selectedSuggestionIndex = -1; // Reset selection
}

/**
 * Hides the autocomplete suggestions dropdown.
 */
function hideAutocomplete() {
  autocompleteSuggestions.classList.add('hidden');
  selectedSuggestionIndex = -1;
}

/**
 * Handles keyboard navigation within the autocomplete suggestions.
 */
function handleAutocompleteKeydown(event: KeyboardEvent) {
  const suggestions = autocompleteSuggestions.querySelectorAll('div');
  if (suggestions.length === 0 || autocompleteSuggestions.classList.contains('hidden')) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
    updateSuggestionSelection(suggestions);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
    updateSuggestionSelection(suggestions);
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    if (selectedSuggestionIndex > -1) {
      event.preventDefault();
      applySuggestion(suggestions[selectedSuggestionIndex].dataset.value!);
    }
  } else if (event.key === 'Escape') {
    hideAutocomplete();
  }
}

/**
 * Updates the visual selection highlight on autocomplete items.
 */
function updateSuggestionSelection(suggestions: NodeListOf<HTMLDivElement>) {
  suggestions.forEach((el, index) => {
    el.classList.toggle('selected', index === selectedSuggestionIndex);
    if (index === selectedSuggestionIndex) {
      el.scrollIntoView({ block: 'nearest' });
    }
  });
}

/**
 * Handles clicks on an autocomplete suggestion.
 */
function handleSuggestionClick(event: MouseEvent) {
  const target = event.target as HTMLDivElement;
  if (target.dataset.value) {
    applySuggestion(target.dataset.value);
  }
}

/**
 * Inserts the selected suggestion into the prompt input.
 */
function applySuggestion(suggestion: string) {
  const cursorPos = promptInput.selectionStart;
  const textUpToCursor = promptInput.value.substring(0, cursorPos);
  const currentWordMatch = textUpToCursor.match(/[\w-]+$/);

  if (currentWordMatch) {
    const startIndex = currentWordMatch.index!;
    const before = promptInput.value.substring(0, startIndex);
    const after = promptInput.value.substring(cursorPos);

    promptInput.value = before + suggestion + ' ' + after;

    const newCursorPos = (before + suggestion + ' ').length;
    promptInput.focus();
    promptInput.setSelectionRange(newCursorPos, newCursorPos);
  }

  hideAutocomplete();
  handlePromptInput();
}


/**
 * Converts a file to a base64 encoded string.
 */
function fileToGenerativePart(file: File): Promise<{
  inlineData: {
    data: string;
    mimeType: string;
  };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject('Failed to read file');
      }
      // The result includes the Base64 prefix, which we need to remove.
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


/**
 * Analyzes the uploaded audio for BPM and chords.
 */
async function analyzeAudio() {
  if (!audioFile) {
    alert('Please upload an audio file first.');
    return;
  }

  analyzeBtn.disabled = true;
  analysisLoader.style.display = 'block';
  analysisResult.classList.add('hidden');

  try {
    const audioPart = await fileToGenerativePart(audioFile);
    const prompt = `Analyze this audio file. Determine its BPM (Beats Per Minute), primary chord progression, musical key, and overall structure (e.g., Intro, Verse, Chorus, Bridge, Outro). Respond ONLY with a JSON object containing 'bpm' (as a number), 'chords' (as an array of strings), 'key' (as a string, e.g., "C Major"), and 'structure' (as an array of strings).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {parts: [audioPart, {text: prompt}]},
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bpm: {type: Type.NUMBER},
            chords: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
            },
            key: {type: Type.STRING},
            structure: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    bpmResult.textContent = Math.round(result.bpm).toString();
    chordsResult.textContent = result.chords.join(', ');
    keyResult.textContent = result.key;
    structureResult.textContent = result.structure.join(', ');
    metronomeBpm.value = Math.round(result.bpm).toString();

    analysisResult.classList.remove('hidden');
  } catch (error) {
    console.error('Audio analysis failed:', error);
    alert('Could not analyze the audio. Please try another file.');
  } finally {
    analyzeBtn.disabled = false;
    analysisLoader.style.display = 'none';
  }
}


/**
 * Toggles the UI into a loading or finished state.
 * @param isLoading - Whether the app is currently generating a video.
 */
function setUILoading(isLoading: boolean) {
  generateBtn.disabled = isLoading;
  promptInput.disabled = isLoading;
  styleSelect.disabled = isLoading;
  audioUpload.disabled = isLoading;
  imageUpload.disabled = isLoading;
  clearImageBtn.disabled = isLoading;
  videoTypeVisual.disabled = isLoading;
  videoTypeLyrics.disabled = isLoading;
  lyricsInput.disabled = isLoading;
  analyzeBtn.disabled = isLoading;
  resolution720p.disabled = isLoading;
  resolution1080p.disabled = isLoading;


  if (isLoading) {
    outputPlaceholder.style.display = 'none';
    videoResult.style.display = 'none';
    imageResult.style.display = 'none';
    loader.style.display = 'block';
    startLoadingAnimation();
  } else {
    loader.style.display = 'none';
    stopLoadingAnimation();
  }
}

/**
 * Starts cycling through the loading messages.
 */
function startLoadingAnimation() {
  let messageIndex = 0;
  loadingMessage.textContent = loadingMessages[messageIndex];
  loadingInterval = window.setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingMessage.textContent = loadingMessages[messageIndex];
  }, 4000);
}

/**
 * Stops the loading message animation.
 */
function stopLoadingAnimation() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}

/**
 * Displays an error message in the output area.
 * @param message - The error message to display.
 */
function displayError(message: string) {
  setElementInnerHtml(
    outputArea,
    sanitizeHtml(`<p class="error">${message}</p>`)
  );
  outputPlaceholder.style.display = 'block';
}

/**
 * Main dispatcher to handle the generation process.
 */
async function handleGenerateClick() {
  const prompt = promptInput.value;
  if (!prompt) {
    alert('Please describe the visuals or edits for your creation.');
    return;
  }

  const isLyricsVideo = videoTypeLyrics.checked;
  const lyrics = lyricsInput.value;

  if (isLyricsVideo && !lyrics && audioFile) {
    alert('Please add lyrics for your lyrics video.');
    return;
  }

  setUILoading(true);
  generatedVideoBlob = null;
  generatedImageBlob = null;

  try {
    if (sourceImageFile && !audioFile) {
      await editImage();
    } else if (audioFile) {
      await generateVideo();
    }
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    displayError(`Failed to generate visuals: ${errorMessage}`);
  } finally {
    setUILoading(false);
  }
}

/**
 * Edits an image based on a prompt.
 */
async function editImage() {
  if (!sourceImageFile) return;

  const imagePart = await fileToGenerativePart(sourceImageFile);
  const textPart = {text: promptInput.value};

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {parts: [imagePart, textPart]},
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      imageViewer.src = imageUrl;

      // Convert base64 to Blob for download
      const fetchResponse = await fetch(imageUrl);
      generatedImageBlob = await fetchResponse.blob();

      imageResult.style.display = 'flex';
      return;
    }
  }

  throw new Error('Image editing failed. The model did not return an image.');
}

/**
 * Generates a video from text, or text and an image.
 */
async function generateVideo() {
  const prompt = promptInput.value;
  const isLyricsVideo = videoTypeLyrics.checked;
  const lyrics = lyricsInput.value;
  const style = styleSelect.value;
  const resolution = (
    document.querySelector('input[name="resolution"]:checked') as HTMLInputElement
  ).value;
  const resolutionText = resolution === '1080p' ? 'Full HD 1080p' : 'HD 720p';

  let fullPrompt = '';
  if (isLyricsVideo) {
    const fontFamily = fontSelect.value;
    const fontSize = fontSizeInput.value;
    const fontColor = fontColorInput.value;
    const animationStyle = animationSelect.options[animationSelect.selectedIndex].text;

    fullPrompt = `Create a ${style}, ${resolutionText} resolution lyrics video with animated text for the following lyrics. The background visuals should be based on this description: "${prompt}".

Text Style Instructions:
- Animate the lyrics with a "${animationStyle}" effect.
- The text should use the "${fontFamily}" font.
- Set the font size to approximately ${fontSize}px.
- The font color should be a hex value of "${fontColor}".

Lyrics:
${lyrics}`;
  } else {
    fullPrompt = `A ${style}, ${resolutionText} resolution music video of ${prompt}`;
  }

  const image = sourceImageFile ?
    await fileToGenerativePart(sourceImageFile) :
    undefined;

  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: fullPrompt,
    ...(image && {
      image: {
        imageBytes: image.inlineData.data,
        mimeType: image.inlineData.mimeType,
      },
    }),
    config: {
      numberOfVideos: 1,
    },
  });

  // Poll for the result
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation});
  }

  if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
    throw new Error('Video generation failed or returned no URI.');
  }

  const downloadLink = operation.response.generatedVideos[0].video.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
  }

  generatedVideoBlob = await videoResponse.blob();
  const videoUrl = URL.createObjectURL(generatedVideoBlob);

  videoPlayer.src = videoUrl;
  videoResult.style.display = 'flex';
  shareVideoBtn.classList.remove('hidden');
}

/**
 * Handles showing the share modal and populating links.
 */
function handleShareClick() {
  const url = window.location.href;
  const text = "Check out this video I made with the AI Music Video Generator!";

  shareLinkInput.value = url;

  shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  shareReddit.href = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;

  shareModal.classList.remove('hidden');
}

/**
 * Copies the share link to the clipboard.
 */
function copyShareLink() {
  shareLinkInput.select();
  document.execCommand('copy');
  copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
  setTimeout(() => {
    copyLinkBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
  }, 2000);
}


/**
 * Handles downloading the generated video.
 */
function handleVideoDownload() {
  if (!generatedVideoBlob) {
    alert('No video has been generated yet.');
    return;
  }

  const url = URL.createObjectURL(generatedVideoBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-music-video.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Handles downloading the generated image.
 */
function handleImageDownload() {
  if (!generatedImageBlob) {
    alert('No image has been generated yet.');
    return;
  }

  const url = URL.createObjectURL(generatedImageBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-edited-image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


/**
 * Toggles the metronome on and off.
 */
function toggleMetronome() {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }

  isMetronomePlaying = !isMetronomePlaying;

  if (isMetronomePlaying) {
    const bpm = parseInt(metronomeBpm.value, 10);
    if (isNaN(bpm) || bpm < 40 || bpm > 240) {
      alert('Please enter a valid BPM (40-240).');
      isMetronomePlaying = false;
      return;
    }
    const interval = (60.0 / bpm) * 1000;

    // Play first tick immediately
    playMetronomeTick();

    metronomeInterval = window.setInterval(playMetronomeTick, interval);
    setElementInnerHtml(
      metronomeToggle,
      sanitizeHtml(`<i class="fa-solid fa-pause"></i>`)
    );
    metronomeToggle.classList.add('active');
  } else {
    if (metronomeInterval) {
      clearInterval(metronomeInterval);
      metronomeInterval = null;
    }
    setElementInnerHtml(
      metronomeToggle,
      sanitizeHtml(`<i class="fa-solid fa-play"></i>`)
    );
    metronomeToggle.classList.remove('active');
  }
}

/**
 * Plays a single metronome tick sound.
 */
function playMetronomeTick() {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  oscillator.start(audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    audioContext.currentTime + 0.05
  );
  oscillator.stop(audioContext.currentTime + 0.05);
}