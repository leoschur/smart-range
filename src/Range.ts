import SmartRange from "./SmartRange";

const handler: ProxyHandler<SmartRange> = {
    has(target, prop) {
        if (typeof prop !== "symbol") {
            const key = +prop;
            if (!isNaN(key)) return target.includes(key);
        }
        return Reflect.has(target, prop);
    },
    set(target, prop, value) {
        return Reflect.set(target, prop, value);
    },
    get(target, prop) {
        if (prop === Symbol.iterator)
            return target[Symbol.iterator].bind(target);
        if (typeof prop !== "symbol") {
            const key = +prop;
            if (!isNaN(key)) return target.at(key);
        }
        return Reflect.get(target, prop);
    },
    // TODO ownKeys(target) {},
    // TODO getOwnPropertyDescriptor(target, p) {},
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
 * // overwritten for numbers by Proxy `value in SmartRange` -> value is included in SmartRange
 * 5 in range // true
 * -5 in range // false
 * // lazy computation of indexed values
 * range[4] // 5
 * range[9] // undefined
 * // negative indexing possible -> this.length + -index
 * range[-1] // 9
 * ```
 * @param start start of the range can be larger than end with negative step
 * @param end end of the range
 * @param step step between values in the range - can be negative defaults to 1 or -1 if end < start
 * @returns {SmartRange} SmartRange wrapped by Proxy
 */
const range = (start: number, end: number, step?: number) =>
    new Proxy(new SmartRange(start, end, step), handler);

export default range;
