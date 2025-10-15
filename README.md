
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
    VITE_GEMINI_API_KEY=your_api_key
    ```
4.  Run the app
    ```sh
    npm run dev
    ```

## Vercel Deployment

1.  **Fork this repository.**
2.  **Create a new project on Vercel and import your forked repository.**
3.  **Configure Environment Variables:**
    -   In the Vercel project settings, go to the "Environment Variables" section.
    -   Add a new environment variable named `VITE_GEMINI_API_KEY` and paste your Gemini API key as the value.
4.  **Deploy:** Vercel will automatically build and deploy your application.

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
