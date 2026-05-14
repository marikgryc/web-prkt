import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://113.30.191.198:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
        secure: false,
      },
    },
  },
})