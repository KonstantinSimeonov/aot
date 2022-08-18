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

type OneOf<T> =
  T extends [infer PR, ...infer PRS]
    ? PR extends [infer X, infer XS]
      ? X extends Empty
          ? OneOf<PRS>
          : [X, XS]
      : OneOf<PRS>
    : Empty

type Comma<T> = T extends `,${infer XS}` ? XS : T
type Whitespace<T> = T extends `${`\n` | ` ` | `\t` | `\r`}${infer XS}` ? Whitespace<XS> : T

type ParseValue<T> = OneOf<[ParseInt<T>, ParseBoolean<T>, ParseString<T>, ParseArray<T>, ParseObject<T>]>

type ParseArrayItems<T, Result extends any[] = []> =
  T extends `]${infer XS}`
    ? [Result, XS]
    : ParseValue<T> extends [infer V, infer Rest]
        ? V extends Empty ? [Empty, T] : ParseArrayItems<Whitespace<Comma<Rest>>, [...Result, V]>
        : [Empty, T]

type ParseArray<T> =
  T extends `[${infer XS}`
    ? ParseArrayItems<XS>
    : [Empty, T]

type ParseKVP<T> =
  ParseString<T> extends [infer Key, infer Rest]
    ? Key extends `"${infer Key}"`
      ? Whitespace<Rest> extends `:${infer Rest2}`
          ? ParseValue<Whitespace<Rest2>> extends [infer V, infer Rest3]
              ? V extends Empty ? [Empty, T] : [{ [k in Key]: V }, Rest3]
              : [Empty, T]
          : [Empty, T]
      : [Empty, T]
    : [Empty, T]

type ParseObjectEntries<T, Obj extends Record<string, any> = {}> =
  T extends `}${infer Rest}`
    ? [{ [k in keyof Obj]: Obj[k] }, Rest]
    : ParseKVP<Whitespace<T>> extends [infer V, infer Rest]
        ? V extends Empty
          ? [1, T]
          : ParseObjectEntries<Whitespace<Comma<Whitespace<Rest>>>, Obj & V>
        : [2, T]

type ParseObject<T> =
  T extends `{${infer XS}`
    ? ParseObjectEntries<XS>
    : [Empty, T]

type tests = {
  het_array: `[1, "nqkvi raboti", 2, true, 4, "kiril"]`
  num_array: `[1, 2, 3, 4]`
  bool_array: `[true, false,false,true]`
  str_array: `["kiro","miro","gosho", "i",    "ivan"]`
  nested: `[1, 2, ["haha"], [[[1]]]]`
  simple_object: `{ "a": 5, "b": false }`,
  //empty_object: `{    }`
  object_with_arrays: `{ "stuff": ["1", 1, ["hello"]], "aha": false }`
  nested_object: `{ "point": { "x": 3, "y": 4 } }`
  array_with_objects: `[{ "a": 5 }, { "hello": "there" }]`
  number: `32`
  false: `false`
  string: `"testyyy"`,
  object_array_object_array: `{ "nesting": [{ "nesting2": [1, 2, 3] }] }`
}

type run_tests<T extends Record<string, string>> = {
  [k in keyof T]: ParseValue<T[k]>
}

type output = run_tests<tests>['object_array_object_array']
