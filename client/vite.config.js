import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    outDir: resolve(__dirname, "../client/dist"),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
