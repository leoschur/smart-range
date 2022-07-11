import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**"],
        exclude: ["**/node_modules/**", "**/lib/**"],
        coverage: {
            include: ["src/**"],
            all: true,
        },
    },
});
