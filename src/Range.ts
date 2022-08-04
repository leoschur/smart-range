/**!
 * Copyright (c) 2022 Leo Schurrer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import SmartRange from "./SmartRange";

/**
 * ProxyHandler for the SmartRange
 * provides the traps for related calls
 * more documentation can be found at
 * @see https://javascript.info/proxy
 */
const handler: ProxyHandler<SmartRange> = {
    has(target, prop) {
        if (typeof prop !== "symbol") {
            const key = +prop;
            // if key is convertable to number return if value is included in range
            if (!isNaN(key)) return target.includes(key);
        }
        return Reflect.has(target, prop);
    },
    set(target, prop, value) {
        return Reflect.set(target, prop, value);
    },
    get(target, prop) {
        // Iterator has to be handled extra to bind target
        if (prop === Symbol.iterator)
            return target[Symbol.iterator].bind(target);
        if (typeof prop !== "symbol") {
            const key = +prop;
            // if key is convertable to number return indexed value instead
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
