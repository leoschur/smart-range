/**
 * # SmartRange
 * offers a python like range object with "lazy" implementation
 * @example
 * ```ts
 * const r = new SmartRange(0, 10, 2) // 0, 2, 4, 6, 8
 * r.length // 5
 * const a = [...r]; // [0,2,4,6,8]
 * // stepsize defaults to 1 | -1
 * new SmartRange(2,-3) // 2, 1, 0, -1, -2
 * ```
 * @implements {Iterable<number>}
 * @implements {Iterator<number, undefined>}
 * @implements {ArrayLike<number>}
 * @author Leo Schurrer <l.schurrer@outlook.com>
 * @license MIT
 */
export default class SmartRange
    implements ArrayLike<number>, Iterator<number, undefined>, Iterable<number>
{
    // index signature only usefull if class is used with Proxy
    [index: number]: number;

    // private members
    #start: number;
    #end: number;
    #step: number;
    /** number of steps performed by the Iterator protocol */
    #doneSteps: number = 0;

    /**
     * ## Constructor
     * values need to be integers
     * @param start start of the range can be larger than end with negative step
     * @param end end of the range
     * @param step step between values in the range - can be negative defaults to 1 or -1 if end < start
     */
    constructor(start: number, end: number, step?: number) {
        //  TODO accept options for excludeStart, includeEnd
        if (
            !Number.isInteger(start) || !Number.isInteger(end) || step
                ? !Number.isInteger(step)
                : false
        ) {
            throw new TypeError(
                "SmartRange: start, end and step must be integers"
            );
        }
        this.#start = start;
        this.#end = end;
        this.#step =
            step === undefined || step === 0 ? this.#defaultStep : step;
    }

    get start(): number {
        return this.#start;
    }
    get end(): number {
        return this.#end;
    }
    get step(): number {
        return this.#step;
    }
    get length(): number {
        if (this.#isInvalid) return 0;
        const res = Math.abs(this.#end - this.#start) / this.#step;
        return res < 0 ? Math.floor(res) : Math.ceil(res);
    }
    get #defaultStep(): number {
        return this.#start < this.#end ? 1 : -1;
    }
    get #isInvalid(): boolean {
        const cond1 = this.#start < this.#end && this.#step < 0;
        const cond2 = this.#end < this.#start && 0 < this.#step;
        return cond1 || cond2;
    }

    set start(v: number) {
        if (this.#start === v) return;
        if (!Number.isInteger(v))
            throw new TypeError("SmartRange: start needs to be integer");
        this.#start = v;
    }
    set end(v: number) {
        if (this.#end === v) return;
        if (!Number.isInteger(v))
            throw new TypeError("SmartRange: end needs to be integer");
        this.#end = v;
    }
    set step(v: number | undefined) {
        if (this.step === v) return;
        if (!Number.isInteger(v))
            throw new TypeError("SmartRange: step needs to be integer");
        // FIXME what happens to this.#doneSteps when step size is changed after steps are already done
        if (this.#doneSteps)
            console.warn(
                "SmartRange: changing step size after Iterator is called resulting in undefined behaviour!"
            );
        this.#step = v === undefined || v === 0 ? this.#defaultStep : v;
    }

    /**
     * ### next
     * implements Iterator protocol
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
     * @returns {IteratorResult<number, undefined>} next value in the range
     */
    next(): IteratorResult<number, undefined> {
        if (this.#doneSteps < this.length && !this.#isInvalid) {
            return {
                done: false,
                value: this.#start + this.#doneSteps++ * this.#step,
            };
        }
        return { done: true, value: undefined };
    }

    /**
     * ## return
     * implements Iterator protocol
     * resets the iterator to the start of the range
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
     * @returns {IteratorResult<number, undefined>} next value in the range
     */
    return(): IteratorResult<number, undefined> {
        this.#doneSteps = 0;
        return { done: true, value: undefined };
    }

    /**
     * ## Iterable
     * implements Iterable protocol
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol
     * @example
     * ```ts
     * const r = new SmartRange(1, 5); // 1, 2, 3, 4
     * let sum = 0;
     * for (let value of r) sum += value; // 0 += 1; 1 += 2; 3 += 3; 6 += 4;
     * sum // 10
     * ```
     * @yields {number} next value in the range
     */
    *[Symbol.iterator]() {
        if (this.#isInvalid) return;
        const cond = this.#start < this.#end;
        let v = this.#start;
        do {
            yield v;
            v += this.#step;
        } while (cond ? v < this.#end : this.#end < v);
    }

    /**
     * ## forEach
     * ease of use interface
     * takes callback and passes it to Array.from()
     * @example
     * ```ts
     * const r = new SmartRange(0, -5); // 0, -1, -2, -3, -4
     * r.forEach((v, i) => i % 2 ? i : -i); // [0,-1,2,-3,4]
     * ```
     * @param cb (value, index) => T
     * @returns {T[]} resulting array
     */
    forEach<T>(cb: (v: number, i?: number) => T): T[] {
        return Array.from(this, cb);
    }

    /**
     * ## includes
     * ease of use interface
     * creates array and calls includes with passed value on it
     * @param v value
     * @returns {boolean} true if value is in the range
     */
    includes(v: number): boolean {
        if (!Number.isInteger(v)) return false;
        return [...this].includes(v);
    }
}
