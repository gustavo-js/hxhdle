import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use /hxhdle/ base when building for GitHub Pages; keep / for local dev.
  base: process.env.GITHUB_ACTIONS ? '/hxhdle/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    passWithNoTests: true,
  },
})
