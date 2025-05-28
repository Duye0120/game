import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }
        warn(warning);
      }
    }
  }
})
