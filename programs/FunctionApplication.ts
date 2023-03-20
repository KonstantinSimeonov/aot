import * as Int from "../data/Int"
import * as List from "../data/List"

type IsString<T> = T extends string ? true : false

declare module "../data/Function" {
  interface Declarations<T> {
    ToBin: Int.FromIntConst<T>
    IsString: IsString<T>
  }
}

type xs = List.LMap<"ToBin", [1, 2, 3]>

type only_strings = List.Filter<"IsString", [1, 2, "a", true, "c"]>
