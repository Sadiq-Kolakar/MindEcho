import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 45002,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 45002,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
})
