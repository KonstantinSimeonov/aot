type Person = {
  name: string;
  friends: Map<string, Person>;
  hobbies: [{ name: string; since: Date; }, { name: string; since: Date; }]
}

// accessing of nested types
type Zoom<Keys, T> =
  Keys extends []
    ? T
    : Keys extends [infer k, ...infer keys]
      ? (
        T extends Map<infer MK, infer MV>
          ? (k extends MK ? Zoom<keys, MV> : never)
          : (k extends keyof T ? Zoom<keys, T[k]> : never)
      )
      : never;

// the type-level equivalent of the runtime person.friends.get(somestring)?.hobbies[somenumber].since
type x = Zoom<['friends', string, 'hobbies', number, 'since'], Person>
