// ساخت نسخه تک‌فایلی (Single-file build):
// خروجی یک فایل HTML مستقل است که می‌توان آن را بدون سرور،
// با دابل‌کلیک یا ارسال از طریق پیام‌رسان، در مرورگر باز کرد.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist-single",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 20_000,
    rollupOptions: {
      input: "index.single.html",
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
