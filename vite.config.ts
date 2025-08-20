import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  server: {
    port: 5002, // We'll run this on a new port
    cors: true,
  },
  plugins: [
    react(),
    federation({
      name: "audioMfe",
      filename: "remoteEntry.js",
      exposes: {
        // We will expose a single 'AudioPanel' component
        "./AudioPanel": "./src/AudioPanel",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
