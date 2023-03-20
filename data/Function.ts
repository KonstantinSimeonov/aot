export interface Declarations<T> {
  Array: T[]
  String: T extends string | number | boolean ? `${T}` : never
}

export type FNames = keyof Declarations<any>
export type Apply<F extends FNames, A> = Declarations<A>[F]
