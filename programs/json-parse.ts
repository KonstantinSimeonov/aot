type Digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type Str2Dec<T extends string, Acc extends any[] = []> = `${T}` extends `${Acc['length']}`
  ? Acc['length']
  : Str2Dec<T, [...Acc, 0]>

type Empty = { __x: never }
type Failure<T extends string> = { __reason: T }

type ParseInt<T, N extends string = ""> =
  T extends `${infer X}${infer XS}`
    ? X extends Digits
        ? ParseInt<XS, `${N}${X}`>
        : [N extends "" ? Empty : Str2Dec<N>, T]
    : [N extends "" ? Empty : Str2Dec<N>, T]

type ParseBoolean<T> =
  T extends `true${infer XS}`
    ? [true, XS]
    : T extends `false${infer YS}`
        ? [false, YS]
        : [Empty, T]

type ParseString<T> = T extends `"${infer Str}"${infer Rest}`
  ? [`"${Str}"`, Rest]
  : [Empty, T]

type Find<T> =
  T extends [infer PR, ...infer PRS]
    ? PR extends [infer X, infer XS]
      ? X extends Empty
          ? Find<PRS>
          : [X, XS]
      : Find<PRS>
    : Empty

type Comma<T> = T extends `,${infer XS}` ? XS : T
type Whitespace<T> = T extends ` ${infer XS}` ? Whitespace<XS> : T

type ParseArrayItems<T, Result extends any[] = []> =
  T extends `]${infer XS}`
    ? [Result, XS]
    : Find<[ParseInt<T>, ParseBoolean<T>, ParseString<T>]> extends [infer V, infer Rest]
        ? V extends Empty ? [Empty, T] : ParseArrayItems<Whitespace<Comma<Rest>>, [...Result, V]>
        : [Empty, T]

type ParseArray<T> =
  T extends `[${infer XS}`
    ? ParseArrayItems<XS>
    : [Empty, T]

type tests = {
  het_array: `[1, "nqkvi raboti", 2, true, 4, "kiril"]`
  num_array: `[1, 2, 3, 4]`
  bool_array: `[true, false,false,true]`
  str_array: `["kiro","miro","gosho", "i",    "ivan"]`
}

type run_tests<T extends Record<string, string>> = {
  [k in keyof T]: ParseArray<T[k]>
}

type output = run_tests<tests>
