# smart-range
[![build](https://github.com/leoschur/smart-range/actions/workflows/build.yml/badge.svg)](https://github.com/leoschur/smart-range/actions/workflows/build.yml)
[![tests](https://github.com/leoschur/smart-range/actions/workflows/tests.yml/badge.svg)](https://github.com/leoschur/smart-range/actions/workflows/tests.yml)

> JS/TS package implementing a pythonic range object. The interface is similar to a normal JS Array.

---

## Install

```
npm i @leoschur/smart-range
```

```
yarn add @leoschur/smart-range
```

## Examples

### Basic Usage

use exported range Function to create the SmartRange object with Proxy to use all features

```ts
import range from "@leoschur/smart-range";
// range(start, end[, step])
const r = range(0, 10, 2);
// using with iterable protocol
console.log([...r]); // => [0, 2, 4, 6, 8]
for (const i of r) console.log(i); // => 0 2 4 6 8
// accessing values (lazy computed)
console.log([r[3], r[-2]]); // [4, 6]
console.log([r.start, r.end, r.step, r.length]); // => [0, 10, 2, 5]
// check if a value is in range
console.log(8 in r); // => true
console.log(-2 in r); // => false
```

### Range over ASCII chars

```ts
import range from "@leoschur/smart-range";
const afk = range("A".charCodeAt(), "K".charCodeAt() + 1, 5);
console.log(afk.map((v) => String.fromCharCode(v)).join("")); // => AFK
```

## Documentation

### Exports

smart-range exports the base Object `SmartRange` and `range` function (default export), which returns a SmartRange Object wrapped by a Proxy. The Proxy is used to offer a syntactical nicer interface. If you have no use for that or you are using a environment that does not support Proxies use the SmartRange object directly, else just use the range function.

```ts
import range, { SmartRange } from "@leoschur/smart-range";
```

### Params

-   `start` {int} start of the range can be larger than end if step size is negative
-   `end` {int} end of the range
-   `step` {int} step between values in the range - can be negative defaults to 1 or -1 if end < start

```ts
const [start, end, step] = [0, 10, 2];
const r1 = range(start, end, step);
console.log([r1.start, r1.end, r1.step]); // => [0, 10, 2]
const r2 = range(end, start);
console.log([r2.start, r2.end, r2.step]); // => [10, 0, -1]
```

### Properties

-   `.start` get/set start of the range, integer only
-   `.end` get/set end of the range, integer only
-   `.step` get/set step between values, integer only
-   `.length` readonly returns resulting length of the range, computed on access, length is negative for negative step size
-   `[index]` get number at index, only available when `SmartRange` is created with `range` function otherwise use `SmartRange.at(index)`

### `SmartRange.next()` & `SmartRange.return()`

Implements the [Iterator Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol). The class uses a internal (private) counter that increases with each `next()` call. Changing one of the properties (`start`, `end`, `step`) after `next()` was already called will result in undefined behavior when `next()` is called again afterwards. The internal counter or rather Iterator can be reset by calling `return()`.

### `SmartRange.map(callBack)`

Applies callBack to each element and returns resulting Array. Same as `new Array(SmartRange, callBack)` or `[...SmartRange].map(callBack)`. Just for convenience.

### `SmartRange.includes(number)` | `number in range(a,z)`

Checks if number is included in the Range. The Proxy version does the same thing but it still offers default behavior when the number/ string passed is not convertible as number.

```ts
const r = range(5, 51, 5);
console.log(r.includes(30)); // => true
console.log(30 in r); // => true
console.log(13 in r); // => false
console.log("length" in r); // => true
```

If you need to check more numbers you should convert the SmartRange once to an Array and check on that because as of right now it is converted to an array internally each call.

### `SmartRange.at(index)` | `(range(a,z))[index]`

Returns value at the index. The index can be negative as well to access values from the back.

```ts
const r = range(0, 10);
console.log(r[-1] == r.at(r.length - 1)); // => true
```

## Contribute

-   PR's are welcome.
-   In case they include new features first open an issue where we can discuss the integration.
-   Any addition should include sufficient documentation and testing.
-   Code is formatted with Prettier Code Formatter default settings.
-   No external dependencies.

<details>
<summary>
<strong>Install dev dependencies</strong>
</summary>

```sh
npm i
```

</details>

<details>
<summary>
<strong>Running Tests</strong>
</summary>
Simply run

```sh
npm run test
```

or

```sh
npm run coverage
```

to get a detailed report.

</details>

## TODO's

-   Features
    -   [ ] support floats (optional with precision loss)
    -   [ ] support generator function as step?
    -   [ ] support chars (automatic conversion ASCII => charCode)
    -   [ ] range collection
-   CI (Github Actions)
    -   [ ] automate build on PR/ push to main
    -   [ ] automate testing && coverage on PR/ push to main
    -   [ ] automate build + github releases && npm publishing on tagging
