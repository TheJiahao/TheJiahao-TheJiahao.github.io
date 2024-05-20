import { getViteConfig } from "astro/config";

export default getViteConfig({
    test: {
        include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        exclude: ["src/tests/e2e/**"],
        environment: "jsdom",
        setupFiles: ["src/tests/setup.ts"],
        reporters: "default",
        coverage: {
            include: ["src"],
            exclude: ["src/tests", "src/content", "src/pages", "**/*.d.ts"],
        },
    },
});