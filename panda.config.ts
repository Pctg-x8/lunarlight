import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
    semanticTokens: {
      colors: {
        app: {
          background: { value: "rgb(24, 28, 42)" },
          text: { value: "#ffe" },
        },
        appheader: {
          bottom: { value: "#046" },
          // TODO: これなんとかapp.backgroundからの派生の形で書けないか？
          background: { value: "rgba(24 28 42 / 60%)" },
        },
        label: {
          normal: {
            background: { value: "#9df" },
            text: { value: "{colors.app.background}" },
          },
        },
      },
    },
  },
  globalCss: defineGlobalStyles({
    body: {
      color: "app.text",
      background: "app.background",
    },
  }),

  // The output directory for your css system
  outdir: "styled-system",
});
