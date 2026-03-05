import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
   globalIgnores(["dist"]),
   {
      files: ["**/*.{js,jsx}"],
      ignores: [ "node_modules/", "public/" /* "src/components/ui/**" */  ],
      extends: [
         js.configs.recommended,
         reactHooks.configs["recommended-latest"],
         reactRefresh.configs.vite,
      ],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
         parserOptions: {
            ecmaVersion: "latest",
            ecmaFeatures: { jsx: true },
            sourceType: "module",
         },
      },
      rules: {
         "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
         "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
         "sort-imports": ["warn", { ignoreCase: true, ignoreDeclarationSort: true }],
         "no-console": "off",
			"no-undefined": "warn",
			"no-var": "error",
			"prefer-const": "error",
			eqeqeq: ["error", "always"],
			"no-implicit-coercion": "error",
			"no-return-await": "error",
			"no-throw-literal": "error",
			"max-depth": ["warn", 4],
			"max-params": ["warn", 8],
			"arrow-body-style": ["error", "as-needed"],
			"prefer-arrow-callback": "error",
			"prefer-template": "error",
			"object-shorthand": "error",
			"no-promise-executor-return": "error",
			"prefer-promise-reject-errors": "error",
			semi: ["error", "always"],
			quotes: ["error", "double"],
			"comma-dangle": ["error", "always-multiline"],
      },
   },
]);
