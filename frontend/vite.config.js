import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the browser talks only to http://localhost:5173.
// Vite forwards /api and /uploads to the Express server, so cookies are same-site.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
