import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";

import { HOURS_IN_DAY, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from "./src/constants";

const MAX_CACHE_ENTRIES = 50;

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  preview: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      jpeg: { quality: 80 },
      png: { quality: 90 },
      webp: { quality: 75 },
      svg: {
        multipass: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192x192.png", "icon-512x512.png"],
      manifest: {
        id: "/",
        name: "얼음땡",
        short_name: "Icebreaking",
        description: "아이스브레이킹 얼음땡",
        start_url: "/",
        scope: "/",
        lang: "ko-KR",
        theme_color: "#687eff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: MAX_CACHE_ENTRIES,
                maxAgeSeconds: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY,
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
