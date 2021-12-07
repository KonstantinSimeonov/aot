export type Bit = 0 | 1

export type Xor<X, Y> = X extends Y ? 0 : 1

export type And<X, Y> = 0 extends X | Y ? 0 : 1

export type Flip<X> = X extends 0 ? 1 : 0

type _2 = [1, 0]
type _3 = [1, 1]
type num_pair = [number, number]
type labeled_num = [number, string]

type x = _2 extends _3 ? true : false

const work_with_non_zero_stuff = (point: [1, 0] | [0, 1] | [1, 1]) => {
  point = [1, 0]
}

const fn = (x: { type: 'gosho'; x: number } | { type: 'liubo' }) => {

}

type _100 = [1, 1, 0, 0, 1, 0, 0]

