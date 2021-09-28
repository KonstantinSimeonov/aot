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
