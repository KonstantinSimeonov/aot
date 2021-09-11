import * as List from '../data/List'
import * as Int from '../data/Int'
import { Bit } from '../data/Bit'

type _3 = Int.FromIntConst<3>
type _5 = Int.FromIntConst<5>

type IsDivisible<Number extends Int.Int16, By extends Int.Int16> =
  Number extends By
    ? true
    : Int.LT<By, Number> extends true ? IsDivisible<Int.Subtr<Number, By>, By> : false

type FizzBuzz<N extends number, XS extends unknown[]> =
  XS['length'] extends N
    ? XS
    : FizzBuzz<
        N,
        [
          [
            XS['length'],
            IsDivisible<Int.FromIntConst<XS['length']>, _3> extends true
              ? 'Fizz'
              : Int.ShowHex<Int.FromIntConst<XS['length']>>
          ],
          ...XS
        ]
      >

type k = FizzBuzz<32, [0]>
