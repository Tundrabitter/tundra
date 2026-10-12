import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tundra/',
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
})