import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "chatMfe", // A unique name for this micro-frontend
      filename: "remoteEntry.js",
      exposes: {
        // './ChatClient' is the alias others will use to import it
        "./ChatPanel": "./src/ChatPanel",
      },
      shared: ["react", "react-dom"], // Libraries to share with the host
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 5001,
  },
  server: {
    port: 4001,
    cors: true,
  },
});
