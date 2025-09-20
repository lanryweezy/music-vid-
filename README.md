<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1NMLwB2BPElsUWxp24bqtJYhnxZXbztER

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in a `.env.local` file to your Gemini API key.
3. Run the app:
   `npm run dev`

## Deploy to Vercel

You can deploy this application to Vercel with a single click.

1.  **Fork this repository** to your own GitHub account.
2.  **Create a new Vercel project** and connect it to your forked repository.
3.  **Set the Environment Variable:** In the Vercel project settings, add an environment variable named `VITE_GEMINI_API_KEY` and set its value to your Gemini API key. Note that for Vite projects, environment variables need to be prefixed with `VITE_` to be exposed to the client-side code.
4.  **Deploy:** Vercel will automatically detect that this is a Vite project and use the correct build settings. Click "Deploy" and your application will be live in a few moments.
