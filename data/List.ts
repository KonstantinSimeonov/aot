import * as Func from './Function';

type BuildList<T, Length extends number, List extends unknown[]> =
  List['length'] extends Length
    ? List
    : BuildList<T, Length, [T, ...List]>

export type From<T, Length extends number> = BuildList<T, Length, []>

export type Set<T, N extends number, List extends unknown[]> = {
  [k in keyof List]:
    k extends `${N}`
      ? T
      : List[k]
}

export type Tail<Tuple extends unknown[]> =
  ((...args: Tuple) => unknown) extends ((_: unknown, ..._1: infer Rest) => unknown)
    ? Rest
    : never

export type Eq<X, Y> = [X, Y] extends [Y, X] ? true : false

export type LMap<K extends Func.FNames, XS extends any[]> =
  XS extends [infer H, ...infer Tail]
    ? [Func.Apply<K, H>, ...LMap<K, Tail>]
    : []

export type Filter<K extends Func.FNames, XS extends any[]> =
  XS extends [infer H, ...infer Tail]
    ? Func.Apply<K, H> extends false | never
        ? [...Filter<K, Tail>]
        : [H, ...Filter<K, Tail>]
    : []
