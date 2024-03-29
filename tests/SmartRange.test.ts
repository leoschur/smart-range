import { describe, expect, test } from "vitest";
import { SmartRange } from "../src";

/**
 * these tests test the core functionality of the SmartRange class
 */
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
        const range = new SmartRange(-14, -8);
        expect(range.start).toBe(-14);
        expect(range.end).toBe(-8);
        expect(range.step).toBe(1);
        expect(range.length).toBe(6);
        expect([...range]).toEqual([-14, -13, -12, -11, -10, -9]);

        range.start = 2;
        range.start = 2;
        expect(() => {
            range.start = 2.5;
        }).toThrowError(TypeError);
        expect(range.start).toBe(2);
        expect(range.end).toBe(-8);
        expect(range.length).toBe(0);
        expect([...range]).toEqual([]);

        range.step = -3;
        range.step = -3;
        expect(() => {
            range.step = -2.5;
        }).toThrowError(TypeError);
        expect(range.step).toBe(-3);
        expect([...range]).toEqual([2, -1, -4, -7]);
        expect(range.length).toBe(-4);

        range.end = 10;
        range.end = 10;
        expect(() => {
            range.end = 0.1;
        }).toThrowError(TypeError);
        expect(range.end).toBe(10);
        expect(range.length).toBe(0);
        expect([...range]).toEqual([]);

        range.step = 0;
        expect(range.step).toBe(1);
        expect(range.length).toBe(8);
        expect([...range]).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);

        expect(new SmartRange(0, -10).step).toBe(-1);
    });

    test("length calculation", () => {
        let range = new SmartRange(0, 7);
        expect([...range]).toEqual([0, 1, 2, 3, 4, 5, 6]);
        expect(range.length).toBe(7);
        range.step = 2;
        expect([...range]).toEqual([0, 2, 4, 6]);
        expect(range.length).toBe(4);
        range.step = 3;
        expect([...range]).toEqual([0, 3, 6]);
        expect(range.length).toBe(3);
        range.step = 4;
        expect([...range]).toEqual([0, 4]);
        expect(range.length).toBe(2);

        [range.end, range.step] = [-7, -1];
        expect([...range]).toEqual([0, -1, -2, -3, -4, -5, -6]);
        expect(range.length).toBe(-7);
        range.step = -2;
        expect([...range]).toEqual([0, -2, -4, -6]);
        expect(range.length).toBe(-4);
        range.step = -3;
        expect([...range]).toEqual([0, -3, -6]);
        expect(range.length).toBe(-3);
        range.step = -4;
        expect([...range]).toEqual([0, -4]);
        expect(range.length).toBe(-2);
    });

    test("iterating SmartRange", () => {
        // Iterable protocol
        const range = new SmartRange(0, 10, 2);
        let i = 0;
        for (const v of range) {
            expect(v).toBe(i * 2);
            i++;
        }
        expect(i).toBe(5);

        // Iterator protocol
        let done: boolean | undefined = false,
            value: number | undefined = undefined;
        i = 0;
        while (true) {
            ({ done, value } = range.next());
            if (done) break;
            expect(value).toBe(i++ * 2);
        }
        expect(i).toBe(5);
        expect(JSON.stringify(range.next())).toBe(
            JSON.stringify({ done: true, value: undefined })
        );
        expect(JSON.stringify(range.return())).toBe(
            JSON.stringify({ done: true, value: undefined })
        );
        expect(JSON.stringify(range.next())).toBe(
            JSON.stringify({ done: false, value: 0 })
        );
        range.return();

        // map function (uses iterable protocol)
        const obj = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8 };
        const transformation =
            "{" + range.map((v, i) => `"${i}":${v}`).join(",") + "}";
        expect(transformation).toBe(JSON.stringify(obj));

        // negative step
        [range.end, range.step] = [-10, -range.step];

        // Iteraable protocol
        expect([...range]).toEqual([0, -2, -4, -6, -8]);
        i = 0;
        for (const v of range) {
            expect(v).toBe(i !== 0 ? i * -2 : 0);
            i++;
        }
        expect(i).toBe(5);

        // Iterator protocol
        done = false;
        value = undefined;
        i = 0;
        while (true) {
            ({ done, value } = range.next());
            if (done) break;
            expect(value).toBe(i !== 0 ? i * -2 : 0);
            i++;
        }
        expect(i).toBe(5);
        expect(JSON.stringify(range.next())).toBe(
            JSON.stringify({ done: true, value: undefined })
        );
        expect(JSON.stringify(range.return())).toBe(
            JSON.stringify({ done: true, value: undefined })
        );
        expect(JSON.stringify(range.next())).toBe(
            JSON.stringify({ done: false, value: 0 })
        );
        const shouldThrow = () => {
            range.step = -4;
        };
        expect(shouldThrow).toThrowError(Error);
    });

    test("includes", () => {
        const range = new SmartRange(5, 18, 2);
        expect(range.includes(5)).toBe(true);
        expect(range.includes(18)).toBe(false);
        expect(range.includes(6)).toBe(false);
        expect(range.includes(7)).toBe(true);
        expect(range.includes(5.6)).toBe(false);
    });

    test("indexing", () => {
        let range = new SmartRange(0, 10);
        expect(range.length).toBe(10);
        expect(range.at(0)).toBe(0);
        expect(range.at(1)).toBe(1);
        expect(range.at(9)).toBe(9);
        expect(range.at(10)).toBe(undefined);
        expect(range.at(-1)).toBe(9);
        expect(range.at(-2)).toBe(8);
        expect(range.at(-9)).toBe(1);
        expect(range.start).toBe(0);
        expect(range.at(-10)).toBe(0);
        expect(range.at(-11)).toBe(undefined);

        range = new SmartRange(0, -10, -2);
        expect(range.length).toBe(-5);
        expect(range.at(0)).toBe(0);
        expect(range.at(1)).toBe(-2);
        expect(range.at(4)).toBe(-8);
        expect(range.at(5)).toBe(undefined);
        expect(range.at(-1)).toBe(-8);
        expect(range.at(-2)).toBe(-6);
        expect(range.at(-4)).toBe(-2);
        expect(range.at(-5)).toBe(0);
        expect(range.at(-6)).toBe(undefined);
    });
});
