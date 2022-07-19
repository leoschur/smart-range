import { describe, test, expect } from "vitest";
import range from "../src";

describe("range", () => {
    test("has trap", () => {
        const r = range(-5, 10);
        expect(5 in r).toBe(true);
        expect(-1 in r).toBe(true);
        expect(10 in r).toBe(false);
        expect(-10 in r).toBe(false);
    });
});
