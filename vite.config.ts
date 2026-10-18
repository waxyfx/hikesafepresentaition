import { defineConfig } from 'vite';

const headers = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};
export default defineConfig({ base: process.env.PRESENTATION_BASE ? `${process.env.PRESENTATION_BASE}/` : '/', server: { headers }, preview: { headers } });

