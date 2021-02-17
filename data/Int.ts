import * as Bit from './Bit'
import * as List from './List'

export type Int16 = List.From<Bit.Bit, 16>

export type Xor<X extends Bit.Bit[], Y extends Bit.Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? Bit.Xor<X[k], Y[k]>
      : X[k]
}

export type And<X extends Bit.Bit[], Y extends Bit.Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? Bit.And<X[k], Y[k]>
      : X[k]
}

type ShiftLeft1<X extends Bit.Bit[]> =
  X extends [infer x, ...infer xs]
    ? [...xs, 0]
    : never

export type Add<X extends Bit.Bit[], Y extends Bit.Bit[]> =
  1 extends Y[keyof Y]
    ? Add<Xor<X, Y>, ShiftLeft1<And<X, Y>>>
    : X

export type Add16<X extends Int16, Y extends Int16> =
  Add<X, Y> extends Int16
    ? Add<X, Y>
    : never

type Flip<X extends Bit.Bit[]> = {
  [k in keyof X]:
    k extends `${number}`
      ? X[k] extends 0 ? 1 : 0
      : X[k]
}

export type Subtr<X extends Bit.Bit[], Y extends Bit.Bit[]> =
  1 extends Y[keyof Y]
    ? Subtr<Xor<X, Y>, ShiftLeft1<And<Flip<X>, Y>>>
    : X

export type LT<X, Y> =
  [X, Y] extends [[infer x, ...infer xs], [infer y, ...infer ys]]
    ? x extends y
      ? LT<xs, ys>
      : 1 extends y
          ? true
          : false
    : false

export type LTE<X, Y> =
  Y extends X
    ? true
    : LT<X, Y>

export type GT<X, Y> =
  LTE<X, Y> extends true
    ? false
    : true

export type GTE<X, Y> =
  Y extends X
    ? true
    : GT<X, Y>

export type Show<X extends Bit.Bit[]> =
  X['length'] extends 0
    ? ``
    : `${X[0]}${Show<List.Tail<X>>}`
