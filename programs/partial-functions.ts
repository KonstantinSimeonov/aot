type AnyFunction = (...args: any[]) => any;

type PartialArgs<T extends any[], Acc extends any[] = []> = T extends [
  infer X,
  ...infer XS
]
  ? Acc | PartialArgs<XS, [...Acc, X]>
  : Acc;

type Drop<A extends any[], B extends any[]> = A extends [infer X, ...infer XS]
  ? B extends [infer Y, ...infer YS]
    ? Y extends X
      ? Drop<XS, YS>
      : A
    : A
  : A;

type PartializeAccum<Fn extends AnyFunction, Acc extends any[]> = {
  (): PartializeAccum<Fn, Acc>;
  <A extends PartialArgs<Drop<Parameters<Fn>, Acc>>>(...args: A): [
    ...Acc,
    ...A
  ] extends Parameters<Fn>
    ? ReturnType<Fn>
    : PartializeAccum<Fn, [...Acc, ...A]>;
};

type Partialize<Fn extends AnyFunction> = {
  (): Partialize<Fn>;
  <Args extends PartialArgs<Parameters<Fn>>>(
    ...args: Args
  ): Args extends Parameters<Fn>
    ? ReturnType<Fn>
    : Partialize<(...args: Drop<Parameters<Fn>, Args>) => ReturnType<Fn>>;
};

const partialize = <FN extends AnyFunction>(fn: FN): Partialize<FN> =>
  function partial(...args: readonly unknown[]) {
    if (args.length === 0) return partial;
    if (args.length >= fn.length) return fn(...args);
    return (...next_args: readonly unknown[]) => partial(...args, ...next_args);
  };

const add4 = (a: number, b: string, c: boolean, d: number): string =>
  a + b + c + d;
const p4 = partialize(add4);

console.log(
  p4(1, "a")(true)(4),
  p4(1)("a")(true)(4),
  p4()()()()(1)()("a")()()(true, 4),
  p4(1, "a", true, 4),
  // @ts-expect-error
  p4(1)("a", true)("4"),
  // @ts-expect-error
  p4({}, "a", true, 4),
  [1, 2, 3, 4].map(p4(1)("a", true)),

  // buggy, should be error
  [1, 2, 3, 4, "4"].map(p4(1)("a", true))
);
