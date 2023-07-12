import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-actions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: cfg => {
    // @ts-ignore
    cfg.resolve.alias["@styled-system"] = path.resolve(__dirname, "../styled-system/");

    return cfg;
  },
} satisfies StorybookConfig;
