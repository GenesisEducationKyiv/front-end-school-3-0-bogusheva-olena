import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import pluginZod from "eslint-plugin-zod";

export default defineConfig([
    {
        files: ["**/*.d.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: false },
                project: undefined,
            },
        },
        rules: {},
    },
    {
        files: [
            "src/**/*.{js,ts,jsx,tsx}",
            "e2e-tests/**/*.ts",
            "int-tests/**/*.{ts,tsx}",
        ],
        ignores: [
            "node_modules",
            "dist",
            "public",
            "playwright/.cache",
            "playwright-report",
            "*.d.ts",
            "**/*.d.ts",
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
                project: "./tsconfig.app.json",
            },
            globals: globals.browser,
        },
        plugins: {
            js,
            "@typescript-eslint": tseslint.plugin,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
            zod: pluginZod,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...pluginReact.configs.flat.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,

            "react/react-in-jsx-scope": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "react/prop-types": "off",
            "no-unused-vars": "off",

            "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },
    {
        ignores: ["node_modules", "dist", "build"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        rules: {
            ...prettier.rules,
        },
    },
]);
