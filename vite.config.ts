/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Use jsdom to simulate a browser environment
    globals: true, // Allows using globals like describe, it, expect without importing
    setupFiles: './vitest.setup.ts', // Optional: Add global setups
  },
});
