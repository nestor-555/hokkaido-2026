import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hokkaido-2026/',
  server: {
    allowedHosts: true
  }
})
