import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
   define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": {},
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ChatBotWidget",
      fileName: () => "widget.js",
      formats: ["iife"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    // emptyOutDir: true,
  },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
