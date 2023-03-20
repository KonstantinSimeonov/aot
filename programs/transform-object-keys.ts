type Key = string | number | symbol
type AnyRecord = Record<string, unknown>

type _Snake2Camel<T extends Key> = T extends `${infer X}_${infer XS}`
  ? `${Capitalize<X>}${_Snake2Camel<XS>}`
  : T extends string
  ? Capitalize<T>
  : T

type Snake2Camel<T extends Key> = T extends `${infer X}_${infer XS}`
  ? `${X}${_Snake2Camel<XS>}`
  : T

type Trim<T extends Key> = T extends `_${infer XS}` ? Trim<XS> : T

type Snake2CamelObject<T extends AnyRecord> = {
  [K in keyof T as Snake2Camel<Trim<K>>]: T[K]
}

type x = Snake2CamelObject<{
  account_id: number
  __test__: boolean
  multiple_under_scores_lol: "test"
  camelKey: "hello"
}>
