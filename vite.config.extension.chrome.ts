import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { version } from './package.json';

// This config is specifically for building the Chrome browser extension (Manifest V3).
export default defineConfig({
  base: './',
  define: {
    'IS_EXTENSION': 'true',
    '__APP_VERSION__': JSON.stringify(version)
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'apps/extension/chrome/manifest.json',
          dest: '.'
        },
        {
          src: 'apps/extension/icons/*',
          dest: 'icons'
        }
      ]
    })
  ],
  build: {
    outDir: 'apps/extension/chrome/dist-chrome',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
