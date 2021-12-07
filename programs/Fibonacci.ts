import * as List from '../data/List'
import * as Int from '../data/Int'

type CalculateFibonacci<N extends Number, Fibs extends Int.Int16[]> =
  Fibs['length'] extends N
    ? Fibs
    : CalculateFibonacci<N, [Int.Add16<Fibs[1], Fibs[0]>, ...Fibs]>

type f0 = List.From<0, 16>
type f1 = List.Set<1, 15, f0>

type fibs10 = CalculateFibonacci<200, [f1, f0]>

type pretty_fibs = {
  [k in Exclude<keyof fibs10, keyof unknown[]>]: Int.ShowHex<fibs10[k]>
}
