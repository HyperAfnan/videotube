import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "public/",
      "build/",
      "logs/",
      "tmp/",
      "src/models/practice/",
    ],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
]);
