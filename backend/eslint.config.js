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
		plugins: { js, prettier: prettierPlugin },
		languageOptions: { globals: { ...globals.browser, ...globals.node }},
		rules: {
			"prettier/prettier": "off",
			"no-console": "off",
			"no-unused-vars": "warn",
			"no-undefined": "error",
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
			"sort-imports": [ "warn", { ignoreCase: true, ignoreDeclarationSort: true }],
		},
	},
]);
