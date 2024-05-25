import eslint from "@eslint/js";
import reactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astroEslint from "eslint-plugin-astro";

export default tseslint.config(
    reactRecommended,
    reactJSXRuntime,
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...astroEslint.configs.recommended,
    {
        ignores: ["dist", ".astro"],
    },
    {
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/no-unknown-property": ["off"],
        },
    },
);
