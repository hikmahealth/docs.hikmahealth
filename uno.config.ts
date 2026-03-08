import { defineConfig, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: "#eef1fb",
        100: "#dbe2f6",
        200: "#b8c5ed",
        300: "#94a7e4",
        400: "#7189db",
        500: "#4d6cd2",
        600: "#2f51b3",
        700: "#26418f",
        800: "#1c316b",
        900: "#132148",
        950: "#0b1530",
      },
      hikma: {
        50: "#eef1fb",
        100: "#dbe2f6",
        200: "#b8c5ed",
        300: "#94a7e4",
        400: "#7189db",
        500: "#4d6cd2",
        600: "#2f51b3",
        700: "#26418f",
        800: "#1c316b",
        900: "#132148",
        950: "#0b1530",
      },
    },
    font: {
      sans: "Inter, Lexend, ui-sans-serif, system-ui, sans-serif",
      mono: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
    },
  },
  shortcuts: {
    // Layout
    "container-doc": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    // Typography
    "prose-heading":
      "font-semibold tracking-tight text-gray-900 dark:text-gray-100",
    // Buttons
    "btn-primary":
      "inline-flex items-center gap-2 rounded-lg bg-hikma-600 px-4 py-2 text-sm font-medium text-white hover:bg-hikma-700 focus:outline-none focus:ring-2 focus:ring-hikma-500 focus:ring-offset-2 transition-colors",
    "btn-secondary":
      "inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-hikma-500 focus:ring-offset-2 transition-colors",
    // Cards
    card: "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm",
    // Sidebar nav links
    "nav-link":
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors",
    "nav-link-active":
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-hikma-50 dark:bg-hikma-900/30 text-hikma-700 dark:text-hikma-400",
    // Code
    "code-inline":
      "rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200",
  },
  rules: [
    // Custom rule: scrollbar-hide utility
    [
      "scrollbar-hide",
      {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
    ],
  ],
});
