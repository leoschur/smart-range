import SmartRange from "./SmartRange";

const handler: ProxyHandler<SmartRange> = {
    has: (target, prop) => {
        if (typeof prop !== "symbol") {
            const key = +prop;
            if (key !== NaN) return target.includes(key);
        }
        return Reflect.has(target, prop);
    },
    get: (target, prop, receiver) => {
        if (typeof prop === "symbol")
            return Reflect.get(target, prop, receiver);
        return target.at(+prop);
    },
    ownKeys(target) {
        console.warn("range: ownKeys is not yet implemented");
        return [
            ...Array.from(target.keys(), (k) => k.toString()),
            ...Reflect.ownKeys(target),
        ];
    },
};

/**
 * # range
 * SmartRange wrapped in Proxy for extra features
 * @see SmartRange ./src/SmartRange.ts
 * @see https://javascript.info/proxy#in-range-with-has-trap
 * @example
 * ```ts
 * const r = range(1, 10, 1);
 * // default behaviour `key in object` -> key is property of object
 * // overritten by Proxy `value in SmartRange` -> value is included in SmartRange
 * 5 in range // true
 * -5 in range // false
 * // lazy computation of indexed values
 * range[4] // 5
 * range[9] // undefined
 * // negative indexing possible -> this.lenght + -index
 * range[-1] // 9
 * ```
 * @param start start of the range can be larger than end with negative step
 * @param end end of the range
 * @param step step between values in the range - can be negative defaults to 1 or -1 if end < start
 * @returns {Proxy<SmartRange>} proxy to a SmartRange
 */
const range = (start: number, end: number, step?: number) =>
    new Proxy(new SmartRange(start, end, step), handler);

export default range;
