# aot

Stands for ahead-of-time <sub><sub>,not attack on titan, although it can be just as nasty</sub></sub>

Various fun programs using the typescript type language only.

![me when typescript 4.5 dropped with type instantiation tail recursion optimizations](./best.gif)

### Challenges

- TS provides no type-level arithmetic
- The compiler bails out of computing types of certain recursive depth (2000 is too much for example)

### Standard library

|             module             |                                                     description                                                      |
| :----------------------------: | :------------------------------------------------------------------------------------------------------------------: |
|     [Int](./data/Int.ts)      | Binary integer implementation which supports addition, subtraction, multiplication, bitwise and/xor/flip/left shift. |
| [Function](./data/Function.ts) |                 Lightweight support for higher-order functions (haven't explored too much as of yet)                 |
|     [List](./data/List.ts)     | Tuple-based lists with operations like eq, from, set and tail. Also supports map and filter via the function module. |

### Programs

- [bracket balancing](./programs/balance-brackets.ts)
- [fibonacci numbers](./programs/Fibonacci.ts)
- [fizzbuzz](./programs/FizzBuzz.ts)
- [parsing json from a string](./programs/json-parse.ts)
- [sieve of erastothenes](./programs/sieve.ts)
- [transform object keys from camel to snake case](./programs/transform-object-keys.ts)
- [split string by separator](./data/String.ts)
- [higher order types](./programs/FunctionApplication.ts)
