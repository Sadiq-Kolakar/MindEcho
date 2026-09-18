import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@splinetool')) return 'spline'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-dom') || id.includes('react/')) return 'react'
        },
      },
    },
  },
  server: {
    port: 43123,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 43123,
    host: true,
    allowedHosts: true,
  },
})
