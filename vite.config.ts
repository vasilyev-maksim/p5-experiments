import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/p5-experiments/" : "/",
  resolve: {
    alias: {
      // Map '@' to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
      // You can add more specific aliases
      "@components": path.resolve(__dirname, "./src/components"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },
}));
