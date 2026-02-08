import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        // Map '@' to the 'src' directory
        "@": path.resolve(__dirname, "./src"),
        // You can add more specific aliases
        "@components": path.resolve(__dirname, "./src/components"),
        "@core": path.resolve(__dirname, "./src/core"),
      },
    },
  };
});
