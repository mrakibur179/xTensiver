import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
    host: true, // or '0.0.0.0'
    allowedHosts: ["7370-220-152-113-173.ngrok-free.app"],
  },
  plugins: [react(), tailwindcss(), flowbiteReact()],
});
