import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { loadEnv } from "vite";
import { DEFAULT_LANGUAGE as defaultLocale } from "./src/config/languages";
import { languageCodes } from "./src/localization";

const { PUBLIC_PORT } = loadEnv(
    process.env.NODE_ENV || "dev",
    process.cwd(),
    "",
);

// https://astro.build/config
export default defineConfig({
    site: "https://thejiahao.github.io",
    integrations: [
        mdx(),
        sitemap(),
        react(),
        UnoCSS({
            injectReset: true, // or a path to the reset file
        }),
    ],
    server: {
        port: Number(PUBLIC_PORT) || 4321,
    },
    i18n: {
        defaultLocale,
        locales: languageCodes,
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: true,
        },
    },
    vite: {
        server: {
            watch: {
                ignored: [
                    "**/playwright-report/**",
                    "**/coverage/**",
                    "**/test-results/**",
                ],
            },
        },
    },
    redirects: {
        "/": {
            destination: "/zh-cn",
            status: 301,
        },
    },
});
