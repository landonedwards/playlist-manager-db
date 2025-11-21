import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        dashboard: "src/pages/dashboard.html",
        editor: "src/pages/editor.html",
        explore: "src/pages/explore.html",
      },
    },
  },
});