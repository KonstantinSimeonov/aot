import * as Int from "../data/Int"

type Mark<End extends Int.Int16, I extends Int.Int16, J extends Int.Int16 = Int.Add<I, I>, Table extends Record<string, Int.Int16> = {}> =
  Int.LTE<End, J> extends true
    ? Table
    : Mark<End, I, Int.Add16<J, I>, Table & { [k in Int.ShowHex<J>]: false }>

type Sieve<End extends Int.Int16, I extends Int.Int16 = Int.FromIntConst<2>, Table extends Record<string, Int.Int16> = {}> =
  I extends End
    ? Table
    : Sieve<
        End,
        Int.Add16<I, Int._1>,
        Table & (Table[Int.ShowHex<I>] extends false ? {} : Mark<End, I>)
      >

type z = Sieve<Int.FromIntConst<30>>
