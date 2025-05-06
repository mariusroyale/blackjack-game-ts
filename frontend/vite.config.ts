import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  server: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/vitest.setup.ts',
  }
} as any);