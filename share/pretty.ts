export type Pretty<T> = T extends (...args: infer A) => infer R
  ? (...args: Pretty<A>) => Pretty<R>
  : T extends object
  ? T extends infer O
    ? { [K in keyof O]: Pretty<O[K]> }
    : never
  : T;
