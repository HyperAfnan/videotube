import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@Store": path.resolve(__dirname, "src/store"),
      "@Features": path.resolve(__dirname, "src/features"),
      "@Shared": path.resolve(__dirname, "src/shared"),
      "@Utils": path.resolve(__dirname, "src/shared/utils"),
      "@Components": path.resolve(__dirname, "src/shared/components"),
      "@Lib": path.resolve(__dirname, "src/shared/lib"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://backend:5000/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
