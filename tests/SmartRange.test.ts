import { describe, expect, test } from "vitest";
import SmartRange from "../src/SmartRange";

describe("SmartRange", () => {
    test("creating SmartRange", () => {
        // 0, 2, 4, 6, 8, end is excluded from the range
        const range = new SmartRange(0, 10, 2);
        expect(() => {
            try {
                new SmartRange(0, 30.2);
            } catch (e) {
                throw e;
            }
        }).toThrowError(TypeError);
        expect(() => {
            try {
                new SmartRange(-0.4, 1);
            } catch (e) {
                throw e;
            }
        }).toThrowError(TypeError);
        expect(() => {
            try {
                new SmartRange(-2, 6, 0.5);
            } catch (e) {
                throw e;
            }
        }).toThrowError(TypeError);
    });

    test("iterating SmartRange", () => {
        const range = new SmartRange(0, 10, 2);
        let i = 0;
        for (const v of range) {
            console.log(v);
            expect(v).toBe(i * 2);
            i++;
        }
        expect(i).toBe(5);
    });
});
