export type Bit = 0 | 1

export type Xor<X, Y> = X extends Y ? 0 : 1

export type And<X, Y> = 0 extends X | Y ? 0 : 1

export type Flip<X> = X extends 0 ? 1 : 0
