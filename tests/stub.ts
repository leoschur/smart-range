import { expect, test } from "vitest";
import { add } from "../src/index";

test("examplary test", () => {
    expect(true).toBe(true);
    expect(add(1, 2)).toBe(3);
});
