export default class SmartRange {
    #start: number;
    #end: number;
    #step: number;
    /** number of steps performed by the Iterator protocol */
    #doneSteps: number = 0;
    #length: number = 0;

    /**
     * SmartRange
     * @param start start of the range can be larger than end with negative step
     * @param end end of the range
     * @param step step between values in the range - can be negative defaults to 1 or -1 if end < start
     */
    constructor(start: number, end: number, step?: number) {
        if (
            !Number.isInteger(start) || !Number.isInteger(end) || step
                ? !Number.isInteger(step)
                : false
        ) {
            throw new TypeError(
                "SmartRange: start, end and step must be integers"
            );
        }
        // TODO resolve case start > end and step is negative
        this.#start = start;
        this.#end = end;
        this.#step = step ?? (start < end ? 1 : -1);
        this.#setLength();
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
        return this.#length;
    }

    set start(v: number) {
        // TODO - validate value
        this.#start = v;
        this.#setLength();
    }
    set end(v: number) {
        // TODO - validate value
        this.#end = v;
        this.#setLength();
    }
    set step(v: number | undefined) {
        if (v && this.#length < v)
            console.warn(
                "SmartRange.step: provided value is greater than length"
            );
        this.#step = v ?? (this.#start < this.#end ? 1 : -1);
        this.#setLength();
    }

    /**
     * implements Iterator protocol
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
     * @returns {IteratorResult<number>} next value in the range
     */
    next(): IteratorResult<number> {
        console.warn("SmartRange.next: not implemented");
        if (this.#doneSteps < this.#length) {
            return {
                done: false,
                value: this.#start + this.#doneSteps++ * this.#step,
            };
        }
        return { done: true, value: undefined };
    }

    /**
     * implements Iterator protocol
     * calls SmartRange.next() one time
     * resets the iterator to the start of the range
     * @returns {IteratorResult<number>} next value in the range
     */
    return(): IteratorResult<number> {
        const res = this.next();
        this.#doneSteps = 0;
        return res;
    }

    /**
     * implements Iterable protocol
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol
     * @yields {number} next value in the range
     */
    *[Symbol.iterator]() {
        let v = this.#start;
        do {
            yield v;
            v += this.#step; // TODO default step to one here
        } while (v < this.end);
    }

    #setLength(): void {
        this.#length = (this.#end - this.#start) / this.#step;
    }
}
