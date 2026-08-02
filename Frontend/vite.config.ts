import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api-proxy': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
      },
    },
  },
})
