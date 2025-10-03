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
			"no-unused-vars": "warn",
			"no-undefined": "error",
			"no-var": "error", // Prefer let/const over var
			"prefer-const": "error", // Use const for variables that aren't reassigned
			eqeqeq: ["error", "always"], // Require === and !== instead of == and !=
			"no-implicit-coercion": "error", // Disallow implicit type conversion
			"no-return-await": "error", // Disallow unnecessary return await
			"no-throw-literal": "error", // Require throwing Error objects
			"max-depth": ["warn", 4], // Warn on deeply nested blocks
			"max-params": ["warn", 8], // Limit number of function parameters
			"arrow-body-style": ["error", "as-needed"], // Enforce concise arrow function bodies when possible
			"prefer-arrow-callback": "error", // Use arrow functions for callbacks
			"prefer-template": "error", // Use template literals instead of string concatenation
			"object-shorthand": "error", // Use shorthand syntax for object methods and properties
			"no-promise-executor-return": "error", // Disallow returning values from Promise executor functions
			"prefer-promise-reject-errors": "error", // Require using Error objects as Promise rejection reasons
			semi: ["error", "always"], // Require semicolons
			quotes: ["error", "double"], // Enforce single quotes
			"comma-dangle": ["error", "always-multiline"], // Enforce trailing commas in multiline
			"sort-imports": [
				"warn",
				{
					// Sort import statements
					ignoreCase: true,
					ignoreDeclarationSort: true,
				},
			],
		},
	},
]);
