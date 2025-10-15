<<<<<<< HEAD
import { defineConfig, loadEnv } from 'vite';
=======
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
>>>>>>> d8b7266df24089474b6aaca80df967dbb743665c
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
<<<<<<< HEAD
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
=======
    plugins: [react(), tsconfigPaths()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
>>>>>>> d8b7266df24089474b6aaca80df967dbb743665c
    },
  };
});