import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Vite plugin to copy dist/index.html to dist/404.html for GitHub Pages SPA routing
function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const path404 = path.join(distDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, path404);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copy404Plugin()],
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/Portfolio/' : '/'),
  server: {
    port: 3000,
    open: false,
  },
});
