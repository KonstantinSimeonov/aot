type AnyFunction = (...args: any[]) => any

type PartialArgs<T extends any[], Acc extends any[] = []> =
    T extends [infer X, ...infer XS]
        ? (Acc | PartialArgs<XS, [...Acc, X]>)
        : Acc

type Drop<A extends any[], B extends any[]> =
  A extends [infer X, ...infer XS]
    ? B extends [infer Y, ...infer YS]
      ? Y extends X ? Drop<XS, YS> : A
      : A
    : A

type PFN<FN extends AnyFunction, Acc extends any[]> = {
  (): PFN<FN, Acc>
  <A extends PartialArgs<Drop<Parameters<FN>, Acc>>>(...args: A): [...Acc, ...A] extends Parameters<FN>
    ? ReturnType<FN>
    : PFN<FN, [...Acc, ...A]>
}

const partialize = <FN extends AnyFunction>(fn: FN): PFN<FN, []> =>
  function partial(...args) {
    if (args.length === 0) return partial
    if (args.length >= fn.length) return fn(...args)
    return (...next_args) => partial(...args, ...next_args)
  }

const add4 = (a: number, b: string, c: boolean, d: number): string => a + b + c + d
const p4 = partialize(add4)

console.log(
  p4(1, 'a')(true)(4),
  p4(1)('a')(true)(4),
  p4()()()()(1)()('a')()()(true, 4),
  p4(1, 'a', true, 4),
  // @ts-expect-error
  p4(1)('a', true)('4'),
  // @ts-expect-error
  p4({}, 'a', true, 4),
  [1, 2, 3, 4].map(p4(1)('a', true)),

  // buggy, should be error
  [1, 2, 3, 4, '4'].map(p4(1)('a', true)),
)
