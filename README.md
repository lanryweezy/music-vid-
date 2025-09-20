<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Music Video Generator

The AI Music Video Generator is a powerful and intuitive web application that allows you to create stunning music videos and edit images using the power of Google's Gemini AI. Whether you're a musician looking to create a visual masterpiece for your latest track, or a creative individual looking to experiment with AI-powered art, this application provides all the tools you need to bring your vision to life.

## Features

-   **AI-Powered Video Generation:** Create unique music videos from a text prompt, with the option to include an image as a source.
-   **AI-Powered Image Editing:** Edit your images using a text prompt to describe the changes you want to make.
-   **Lyrics Video Creation:** Generate a lyrics video with animated text for your song.
-   **Musician's Toolkit:** Analyze your audio files to get the BPM and chords, and use the built-in metronome to help you with your creative process.
-   **Customizable Visuals:** Choose from a variety of visual styles and resolutions to create the perfect look for your video.
-   **Responsive Design:** The application is fully responsive and works great on all devices.
-   **Modern UI:** The user interface is built with React and `shadcn/ui`, providing a clean and modern user experience.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key
    ```
4.  Run the app
    ```sh
    npm run dev
    ```

## Usage

1.  **Upload an audio file:** Click on the "Choose Audio File" button to select an audio file from your computer.
2.  **Analyze your audio (optional):** Once you've uploaded an audio file, you can click on the "Analyze Audio" button to get the BPM and chords of your song.
3.  **Upload an image (optional):** Click on the "Choose Image File" button to select an image file from your computer.
4.  **Describe your visuals:** Use the text area to describe the visuals you want to create. You can also choose from a variety of visual templates.
5.  **Choose a visual style and resolution:** Select a visual style and resolution from the dropdown menus.
6.  **Choose a video type:** Select whether you want to create a visual video or a lyrics video. If you choose to create a lyrics video, you'll need to add your lyrics in the text area.
7.  **Generate your video or image:** Click on the "Generate Video" or "Edit Image" button to start the generation process.
8.  **Download your creation:** Once the generation is complete, you can download your video or image by clicking on the "Download" button.

## API Key

This application requires a Google Gemini API key to function. You can get a free API key from the [Google AI Studio](https://ai.studio.google.com/).

**Important:** For security reasons, you should never expose your API key in a client-side application. This project uses Vite's `define` feature to make the API key available in the client-side code, which is not secure for a commercial application. For a production application, you should use a backend proxy to handle the API calls.
