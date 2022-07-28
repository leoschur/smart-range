import { describe, test, expect } from "vitest";
import range from "../src";

describe("range", () => {
    test("get trap", () => {
        let r = range(0, 10);
        expect(r.start).toBe(0);
        expect(r["end"]).toBe(10);
        expect(r.length).toBe(10);
        expect(r[0]).toBe(0);
        expect(r[1]).toBe(1);
        expect(r[9]).toBe(9);
        expect(r[10]).toBe(undefined);
        expect(r[-1]).toBe(9);
        expect(r[-2]).toBe(8);
        expect(r[-9]).toBe(1);
        expect(r[-10]).toBe(0);
        expect(r[-11]).toBe(undefined);

        r = range(0, -10, -2);
        expect(r.length).toBe(-5);
        expect(r[0]).toBe(0);
        expect(r[1]).toBe(-2);
        expect(r[4]).toBe(-8);
        expect(r[5]).toBe(undefined);
        expect(r[-1]).toBe(-8);
        expect(r[-2]).toBe(-6);
        expect(r[-4]).toBe(-2);
        expect(r[-5]).toBe(0);
        expect(r[-6]).toBe(undefined);
    });

    test("set/ get trap", () => {
        const r = range(-14, -8);
        const r2 = range(20, 30, 5);

        expect(r.start).toBe(-14);
        expect(r.end).toBe(-8);
        expect(r.step).toBe(1);
        expect(r.length).toBe(6);
        expect([...r]).toEqual([-14, -13, -12, -11, -10, -9]);

        r.start = 2;
        expect(r.start).toBe(2);
        expect(r.end).toBe(-8);
        expect(r.length).toBe(0);
        expect([...r]).toEqual([]);

        r.step = -3;
        expect(r.step).toBe(-3);
        expect([...r]).toEqual([2, -1, -4, -7]);
        expect(r.length).toBe(-4);

        r.end = 10;
        expect(r.end).toBe(10);
        expect(r.length).toBe(0);
        expect([...r]).toEqual([]);

        r.step = 0;
        expect(r.step).toBe(1);
        expect(r.length).toBe(8);
        expect([...r]).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);

        expect(r2.start).toBe(20);
        expect(r2.end).toBe(30);
        expect(r2.step).toBe(5);
        expect(r2.length).toBe(2);
        expect([...r2]).toEqual([20, 25]);
    });

    test("has trap", () => {
        const r = range(150, 160, 2);
        expect(150 in r).toBe(true);
        expect(151 in r).toBe(false);
        expect(152 in r).toBe(true);
        expect(0 in r).toBe(false);
        expect(2 in r).toBe(false);
        r.start = -4;
        expect(-4 in r).toBe(true);
        expect(-3 in r).toBe(false);
        expect(-2 in r).toBe(true);
        expect("start" in r).toBe(true);
        expect("end" in r).toBe(true);
        expect("step" in r).toBe(true);
        expect("length" in r).toBe(true);
        expect("next" in r).toBe(true);
        expect("return" in r).toBe(true);
        expect("includes" in r).toBe(true);
        expect("at" in r).toBe(true);
        expect("map" in r).toBe(true);
        expect("isValid" in r).toBe(false);
        expect("defaultStep" in r).toBe(false);
    });
});
