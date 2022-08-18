type Digits = `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9`;

type Str2Dec<
  T extends string,
  Acc extends any[] = []
> = `${T}` extends `${Acc[`length`]}` ? Acc[`length`] : Str2Dec<T, [...Acc, 0]>;

type Fail<T extends string, Context = ``> = { __reason: T; __context: Context };

type ParseInt<T, N extends string = ``> = T extends `${infer X}${infer XS}`
  ? X extends Digits
    ? ParseInt<XS, `${N}${X}`>
    : [N extends `` ? Fail<`not a number`, T> : Str2Dec<N>, T]
  : [N extends `` ? Fail<`not a number`, T> : Str2Dec<N>, T];

type ParseBoolean<T> = T extends `true${infer XS}`
  ? [true, XS]
  : T extends `false${infer YS}`
  ? [false, YS]
  : [Fail<`not a bool`, T>, T];

type ParseString<T> = T extends `"${infer Str}"${infer Rest}`
  ? [`"${Str}"`, Rest]
  : [Fail<`not a string`, T>, T];

type OneOf<T> = T extends [infer PR, ...infer PRS]
  ? PR extends [infer X, infer XS]
    ? X extends Fail<any, any>
      ? OneOf<PRS>
      : [X, XS]
    : OneOf<PRS>
  : Fail<`no parser matched`, T>;

type Comma<T> = T extends `,${infer XS}` ? XS : T;
type Whitespace<T> = T extends `${`\n` | ` ` | `\t` | `\r`}${infer XS}`
  ? Whitespace<XS>
  : T;

type ParseValue<T> = OneOf<
  [ParseInt<T>, ParseBoolean<T>, ParseString<T>, ParseArray<T>, ParseObject<T>]
>;

type ParseArrayItems<T, Result extends any[] = []> = T extends `]${infer XS}`
  ? [Result, XS]
  : ParseValue<T> extends [infer V, infer Rest]
  ? V extends Fail<infer Reason, infer Ctx>
    ? [Fail<`could not parse array value: ${Reason}`, Ctx>, T]
    : ParseArrayItems<Whitespace<Comma<Rest>>, [...Result, V]>
  : [Fail<`unexpected token`, T>, T];

type ParseArray<T> = T extends `[${infer XS}`
  ? ParseArrayItems<XS>
  : [Fail<`expected [`, T>, T];

type ParseKVP<T> = ParseString<T> extends [infer Key, infer Rest]
  ? Key extends `"${infer Key}"`
    ? Whitespace<Rest> extends `:${infer Rest2}`
      ? ParseValue<Whitespace<Rest2>> extends [infer V, infer Rest3]
        ? V extends Fail<infer Reason, infer Ctx>
          ? [Fail<`could not parse kvp value: ${Reason}`, Ctx>, T]
          : [{ [k in Key]: V }, Rest3]
        : [Fail<`parser returned stupid stuff`, T>, T]
      : [Fail<`expected :`, T>, T]
    : [Fail<`string parser returned stupid stuff`, T>, T]
  : [Fail<`whatevs`>, T];

type ParseObjectEntries<
  T,
  Obj extends Record<string, any> = {}
> = T extends `}${infer Rest}`
  ? [{ [k in keyof Obj]: Obj[k] }, Rest]
  : ParseKVP<Whitespace<T>> extends [infer V, infer Rest]
  ? V extends Fail<infer Reason, infer Ctx>
    ? [Fail<`parsing entry failed: ${Reason}`, Ctx>, T]
    : ParseObjectEntries<Whitespace<Comma<Whitespace<Rest>>>, Obj & V>
  : [Fail<`parsing kvp failed`, T>, T];

type ParseObject<T> = T extends `{${infer XS}`
  ? ParseObjectEntries<Whitespace<XS>>
  : [Fail<`expected {`, T>, T];

type tests = {
  het_array: `[1, "nqkvi raboti", 2, true, 4, "kiril"]`;
  num_array: `[1, 2, 3, 4]`;
  bool_array: `[true, false,false,true]`;
  str_array: `["kiro","miro","gosho", "i",    "ivan"]`;
  nested: `[1, 2, ["haha"], [[[1]]]]`;
  simple_object: `{ "a": 5, "b": false }`;
  empty_object: `{    }`
  object_with_arrays: `{ "stuff": ["1", 1, ["hello"]], "aha": false }`;
  nested_object: `{ "point": { "x": 3, "y": 4 } }`;
  array_with_objects: `[{ "a": 5 }, { "hello": "there" }]`;
  number: `32`;
  false: `false`;
  string: `"testyyy"`;
  object_array_object_array: `{ "nesting": [{ "nesting2": [1, 2, 3] }] }`;
  empty_array: `[]`
};

type run_tests<T extends Record<string, string>> = {
  [k in keyof T]: ParseValue<T[k]>;
};

type output = run_tests<tests>;
