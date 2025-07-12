import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        react(),
        svgr({
            include: ["**/*.svg?react", "**/*.svg"],
        }),
    ],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        testTimeout: 100000,
        css: true,
        include: ["src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    },
});

