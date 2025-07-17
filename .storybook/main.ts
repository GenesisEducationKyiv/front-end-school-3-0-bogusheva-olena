import { type StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    async viteFinal(config, options) {
        const { mergeConfig } = await import("vite");
        const { default: svgr } = await import("vite-plugin-svgr");

        return mergeConfig(config, {
            plugins: [svgr()],
        });
    },
};

export default config;
