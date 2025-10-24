import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

import { version } from './package.json';

// This config is specifically for building the browser extension.
export default defineConfig({
  // We need to set the base to a relative path so that the extension can find the assets.
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
    // This plugin copies the necessary extension files to the output directory.
    viteStaticCopy({
      targets: [
        {
          src: 'apps/extension/manifest-v3.json',
          dest: '.'
        },
        {
          src: 'apps/extension/icons/*',
          dest: 'icons'
        }
      ]
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    // The output directory for the extension build.
    outDir: 'apps/extension/dist-chrome',
    // Clean the output directory before each build.
    emptyOutDir: true,
    rollupOptions: {
      // The entry point for the Vue app.
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      plugins: [rollupNodePolyFill()],
      output: {
        // We configure the output file names to be consistent.
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
