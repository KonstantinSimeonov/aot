export type Bit = 0 | 1

type Xor<X, Y> = X extends Y ? 0 : 1
type And<X, Y> = 0 extends X | Y ? 0 : 1

type XorList<X extends Bit[], Y extends Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? Xor<X[k], Y[k]>
      : X[k]
}

type AndList<X extends Bit[], Y extends Bit[]> = {
  [k in keyof X]:
    k extends (keyof Y) & `${number}`
      ? And<X[k], Y[k]>
      : X[k]
}

type ShiftLeft1<X extends Bit[]> =
  X extends [infer x, ...infer xs]
    ? [...xs, 0]
    : never

export type Add<X extends Bit[], Y extends Bit[]> =
  1 extends Y[keyof Y]
    ? Add<XorList<X, Y>, ShiftLeft1<AndList<X, Y>>>
    : X
