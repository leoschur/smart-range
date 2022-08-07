import { C8Options } from "vitest";
import { defineConfig } from "vitest/config";
import nycrc from "./.nycrc.json";

export default defineConfig({
    test: {
        include: ["tests/**"],
        exclude: ["**/node_modules/**", "**/lib/**"],
        coverage: { ...(nycrc as C8Options) },
    },
});
