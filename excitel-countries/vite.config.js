import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/projects/excitel-countries/",
  server: {
    port: 3000,
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:3001",
        rewrite: (path) => path.replace(/^\/.netlify\/functions\/excitel-api/, "/"),
      },
    },
  },
});
