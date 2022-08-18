export {}
type Digits = `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9`;

type Str2Dec<
  T extends string,
  Acc extends any[] = []
> = `${T}` extends `${Acc[`length`]}` ? Acc[`length`] : Str2Dec<T, [...Acc, 0]>;

type Fail<Reason extends string, Ctx> = { __reason: Reason; ctx: Ctx }
type Success<V, Rest> = { __value: V; rest: Rest }

type ParseInt<
  T,
  _n extends string = ``,
  _result = _n extends `` ? Fail<`not a number`, T> : Success<Str2Dec<_n>, T>
> = T extends `${infer D}${infer XS}`
  ? D extends Digits
    ? ParseInt<XS, `${_n}${D}`>
    : _result
  : _result;

type ParseBoolean<T> = T extends `true${infer XS}`
  ? Success<true, XS>
  : T extends `false${infer YS}`
  ? Success<false, YS>
  : Fail<`not a bool`, T>

type ParseString<T> = T extends `"${infer Str}"${infer Rest}`
  ? Success<Str, Rest>
  : Fail<`not a string`, T>

type OneOf<T> = T extends [infer ParseResult, ...infer Rest]
  ? ParseResult extends Success<any, any>
      ? ParseResult
      : OneOf<Rest>
  : Fail<`no parser matched`, T>;

type Comma<T> = T extends `,${infer XS}` ? XS : T;
type Whitespace<T> = T extends `${`\n` | ` ` | `\t` | `\r`}${infer XS}`
  ? Whitespace<XS>
  : T;

type ParseValue<T> = OneOf<
  [ParseInt<T>, ParseBoolean<T>, ParseString<T>, ParseArray<T>, ParseObject<T>]
>;

type ParseArrayItems<T, Result extends any[] = []> = T extends `]${infer XS}`
  ? Success<Result, XS>
  : ParseValue<T> extends Success<infer V, infer Rest>
    ? ParseArrayItems<Whitespace<Comma<Rest>>, [...Result, V]>
    : Fail<`could not parse array value`, T>

type ParseArray<T> = T extends `[${infer XS}`
  ? ParseArrayItems<XS>
  : Fail<`expected [`, T>

type ParseKVP<T> = ParseString<T> extends Success<`${infer Key}`, infer Rest>
  ? Whitespace<Rest> extends `:${infer Rest2}`
    ? ParseValue<Whitespace<Rest2>> extends Success<infer V, infer Rest3>
        ? Success<{ [k in Key]: V }, Rest3>
        : Fail<`could not parse kvp value`, T>
    : Fail<`expected :`, T>
  : Fail<`string parser returned stupid stuff`, T>

type ParseObjectEntries<
  T,
  Obj extends Record<string, any> = {}
> = T extends `}${infer Rest}`
  ? Success<{ [k in keyof Obj]: Obj[k] }, Rest>
  : ParseKVP<Whitespace<T>> extends Success<infer V, infer Rest>
    ? ParseObjectEntries<Whitespace<Comma<Whitespace<Rest>>>, Obj & V>
    : Fail<`parsing entry failed`, T>

type ParseObject<T> = T extends `{${infer XS}`
  ? ParseObjectEntries<Whitespace<XS>>
  : Fail<`expected {`, T>

type tests = {
  simple_object: `{ "a": 5, "b": false }`;
  empty_object: `{    }`;
  object_with_arrays: `{ "stuff": ["1", 1, ["hello"]], "aha": false }`;
  nested_object: `{ "point": { "x": 3, "y": 4 } }`;
  array_with_objects: `[{ "a": 5 }, { "hello": "there" }]`;
  het_array: `[1, "nqkvi raboti", 2, true, 4, "kiril"]`;
  num_array: `[1, 2, 3, 4]`;
  bool_array: `[true, false,false,true]`;
  str_array: `["kiro","miro","gosho", "i",    "ivan"]`;
  nested: `[1, 2, ["haha"], [[[1]]]]`;
  number: `32`;
  false: `false`;
  string: `"testyyy"`;
  object_array_object_array: `{ "nesting": [{ "nesting2": [1, 2, 3] }] }`;
  empty_array: `[]`;
};

type run_tests<T extends Record<string, string>> = {
  [k in keyof T]: ParseValue<T[k]>;
};

type output = run_tests<tests>
