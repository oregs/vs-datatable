import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: 'playground', // playground folder is root
  plugins: [vue(), tsconfigPaths({ projects: ['../tsconfig.app.json'] })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      plugins: fileURLToPath(new URL('./plugins', import.meta.url)),
    },
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: '../dist-playground',
    emptyOutDir: true,
  },
})
