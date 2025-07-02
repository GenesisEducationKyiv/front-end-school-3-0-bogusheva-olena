import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        visualizer({
            filename: "dist/stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        sourcemap: process.env.GENERATE_SOURCEMAP === "true",
        rollupOptions: {
            treeshake: "smallest",
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    form: ["formik", "zod"],
                    state: ["zustand", "@tanstack/react-query"],
                    vendor: ["axios"],
                },
            },
        },
    },
});
