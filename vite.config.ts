import { defineConfig } from 'vite';

export default defineConfig({
  base: '/shrdlu/',
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
