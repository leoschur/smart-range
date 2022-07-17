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

    test("setting/ reading values", () => {
        const range = new SmartRange(-10, -4, 1);
        expect(range.start).toBe(-10);
        expect(range.end).toBe(-4);
        expect(range.step).toBe(1);
        // expect(range.length).toBe(-5);
        range.start = -5;
        expect(range.start).toBe(-5);
        range.end = 10;
        expect(range.end).toBe(10);
        range.step = 1;
        expect(range.step).toBe(1);
        // expect(range.length).toBe(14);
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

    test("includes", () => {
        const range = new SmartRange(5, 18, 2);
        expect(range.includes(5)).toBe(true);
        expect(range.includes(18)).toBe(false);
        expect(range.includes(6)).toBe(false);
        expect(range.includes(7)).toBe(true);
        expect(range.includes(5.6)).toBe(false);
    });
});
