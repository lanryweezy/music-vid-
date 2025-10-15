/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1e1e1e',
        primary: '#ffd700',
        secondary: '#007bff',
        tertiary: '#2a2a2a',
        'on-background': '#e0e0e0',
        'on-surface': '#000000',
        border: '#333333',
        placeholder: '#6a6a6a',
        error: '#ff556c',
      },
    },
  },
  plugins: [],
}
