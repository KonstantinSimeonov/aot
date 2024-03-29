export type Split<Str, Sep> = Sep extends string
  ? Str extends `${infer F}${Sep}${infer S}`
    ? [F, ...Split<S, Sep>]
    : Str extends string
    ? [Str]
    : never
  : never

type str = "user__id_kiro"

type xs = Split<str, "_">
