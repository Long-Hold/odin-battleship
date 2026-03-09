import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";

export default defineConfig([
  {
    ignores: ["webpack.*.js"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
    {
    files: ["**/*.test.js", "**/*.spec.js", "**/tests/**/*.js"],
    plugins: { jest },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...jest.configs["flat/recommended"].rules,
    },
  },
]);
