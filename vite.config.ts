import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('cobe') || id.includes('@react-three/drei')) {
              return 'three-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  plugins: [
    react(),
    // Only generate pre-compressed files if explicitly requested (not needed for Vercel)
    process.env.COMPRESS === 'true' ? compression({ algorithm: 'brotliCompress' }) : null,
    // Visualizer only when analyzing
    process.env.ANALYZE === 'true' ? visualizer({ filename: 'dist/bundle-stats.html', open: false }) : null,
  ].filter(Boolean),
});
