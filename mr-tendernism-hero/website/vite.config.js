import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base is relative so the production build can be dropped into any subpath
// (e.g. later embedded/recreated inside Elementor) and still resolve assets.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // never inline the videos
  },
});
