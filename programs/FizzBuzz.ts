import * as Int from '../data/Int'

type _3 = Int.FromIntConst<3>
type _5 = Int.FromIntConst<5>

type IsDivisible<Number, By> =
    Number extends By
      ? true
      : Int.LT<By, Number> extends true ? IsDivisible<Int.Subtr<Number, By>, By> : false

type FizzyBuzzy<N> = `${
  IsDivisible<Int.FromIntConst<N>, _3> extends true ? 'Fizz' : ''
}${
  IsDivisible<Int.FromIntConst<N>, _5> extends true ? 'Buzz' : ''}`

type FizzBuzz<N extends number, XS extends unknown[]> =
  XS['length'] extends N
    ? XS
    : FizzBuzz<
        N,
        [
          [
            XS['length'],
            FizzyBuzzy<XS['length']> extends ''
              ? Int.ShowHex<Int.FromIntConst<XS['length']>>
              : FizzyBuzzy<XS['length']>
          ],
          ...XS
        ]
      >

type k = FizzBuzz<151, [0]>
