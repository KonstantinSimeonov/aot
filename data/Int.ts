import { Bit, And as BitAnd, Xor as BitXor } from './Bit'
import * as List from './List'

export type Int16 = List.From<Bit, 16>

export type _0 = List.From<0, 16>
export type _1 = List.Set<1, 15, _0>

// stops working around N = 45
export type FromIntConst<N extends number, Acc extends Int16[] = [_1]> =
  Acc['length'] extends N
    ? Acc[0]
    : FromIntConst<N, [Add16<Acc[0], _1>, ...Acc]>

export type Xor<X extends Bit[], Y extends Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? BitXor<X[k], Y[k]>
      : X[k]
}

export type And<X extends Bit[], Y extends Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? BitAnd<X[k], Y[k]>
      : X[k]
}

type ShiftLeft1<X extends Bit[]> =
  X extends [infer x, ...infer xs]
    ? [...xs, 0]
    : never

export type Add<X extends Bit[], Y extends Bit[]> =
  1 extends Y[keyof Y]
    ? Add<Xor<X, Y>, ShiftLeft1<And<X, Y>>>
    : X

export type Add16<X extends Int16, Y extends Int16> =
  Add<X, Y> extends Int16
    ? Add<X, Y>
    : never

type Flip<X extends Bit[]> = {
  [k in keyof X]:
    k extends `${number}`
      ? X[k] extends 0 ? 1 : 0
      : X[k]
}

export type Subtr<X extends Bit[], Y extends Bit[]> =
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

export type ShowBin<X extends Bit[]> =
  X['length'] extends 0
    ? ``
    : `${X[0]}${ShowBin<List.Tail<X>>}`

type HexMap = {
  0: {
    0: {
      0: { 0: '0', 1: '1' },
      1: { 0: '2', 1: '3' }
    },
    1: {
      0: { 0: '4', 1: '5' }
      1: { 0: '6', 1: '7' }
    }
  },
  1: {
    0: {
      0: { 0: '8', 1: '9' },
      1: { 0: 'a', 1: 'b' }
    },
    1: {
      0: { 0: 'c', 1: 'd' }
      1: { 0: 'e', 1: 'f' }
    }
  }
}

export type ShowHex<X extends Bit[]> =
  X extends [infer A, infer B, infer C, infer D, ...infer Bits]
    ? A extends Bit
      ? B extends Bit
        ? C extends Bit
          ? D extends Bit
            ? Bits extends Bit[]
              ? `${HexMap[A][B][C][D]}${ShowHex<Bits>}`
              : never
            : never
          : never
        : never
      : never
    : ``
