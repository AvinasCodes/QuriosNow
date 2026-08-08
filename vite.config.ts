import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ag-grid': ['ag-grid-community', 'ag-grid-react'],
          'vendor-framer-motion': ['framer-motion'],
          'vendor-transformers': ['@huggingface/transformers'],
          'vendor-parsers': ['papaparse', 'xlsx'],
        },
      },
    },
  },
});
