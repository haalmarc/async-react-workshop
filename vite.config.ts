import { defineConfig } from "vite";

export default defineConfig({
  // RSC-direktiver i biblioteker har ingen effekt i denne rene klientappen.
  build: {
    rolldownOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client"))
          return;
        warn(warning);
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": "http://127.0.0.1:3001" },
  },
  preview: { proxy: { "/api": "http://127.0.0.1:3001" } },
});
