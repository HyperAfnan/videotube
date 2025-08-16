import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "src/Components"),
      "@Hooks": path.resolve(__dirname, "src/Hooks"),
      "@Utils": path.resolve(__dirname, "src/utils"),
      "@Store": path.resolve(__dirname, "src/Store"),
      "@Pages": path.resolve(__dirname, "src/Page"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
