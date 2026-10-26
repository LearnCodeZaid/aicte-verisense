import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const BACKEND = process.env.VERISENSE_BACKEND ?? "http://localhost:8001";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5176,
    proxy: {
      "/api": { target: BACKEND, changeOrigin: true },
      "/mock": { target: BACKEND, changeOrigin: true },
    },
  },
  preview: {
    port: 5176,
    proxy: {
      "/api": { target: BACKEND, changeOrigin: true },
      "/mock": { target: BACKEND, changeOrigin: true },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
