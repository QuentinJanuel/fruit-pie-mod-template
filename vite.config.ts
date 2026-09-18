import { defineConfig } from "vite";

export default defineConfig({
  preview: { cors: true, strictPort: true, port: 8080 },
  build: {
    target: "esnext",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: { external: ["electron"] },
  },
});
