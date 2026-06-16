import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Use custom server entry
    server: {
      entry: "server",
    },
  },

  nitro: {
    preset: "vercel",
  },
});
