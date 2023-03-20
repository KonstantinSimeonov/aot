type SnakeToPascalCase<T> = T extends `${infer F}_${infer S}`
  ? `${Capitalize<F>}${SnakeToPascalCase<S>}`
  : T extends string
  ? Capitalize<T>
  : never

type SnakeToCamelCase<T> = Uncapitalize<SnakeToPascalCase<T>>

type names = "user_id" | "kiro_new_id" | "oop" | "sucks_a_lot" | "test__test"

type pascal = SnakeToPascalCase<names>
type camel = SnakeToCamelCase<names>
