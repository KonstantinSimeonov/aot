type Tail<XS extends any[]> = XS extends [any, ...infer T] ? T : never

type AreBracketsBalanced<XS extends string, Open extends any[]> =
  XS extends `${infer B}${infer Rest}`
    ? AreBracketsBalanced<
        Rest,
        B extends "["
          ? [...Open, 0]
          : B extends "]"
            ? Tail<Open>
            : Open
      >
    : Open extends [] ? true : never

type x = AreBracketsBalanced<"[[][][[[]]]]", []>
type y  = AreBracketsBalanced<"[[][][[[]]]]]", []>
type q  = AreBracketsBalanced<"][[][][][]", []>
type z = AreBracketsBalanced<"[[[[[[[[[[][[]][]]]]]]]]]]", []>
