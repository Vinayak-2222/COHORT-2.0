import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
