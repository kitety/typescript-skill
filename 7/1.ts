// 递归
// 递归复用做循环

// DeepPromiseValueType

type ttt = Promise<Promise<Promise<Record<string, any>>>>;

type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<
  infer ValueType
>
  ? ValueType extends Promise<unknown>
    ? DeepPromiseValueType<ValueType>
    : ValueType
  : never;

type DeepPromiseValueTypeRes = DeepPromiseValueType<ttt>;

// ReverseArr
type arr = [1, 2, 3, 4, 5];
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer One,
  infer Two,
  infer Three,
  infer Four,
  infer Five
]
  ? [Five, Four, Three, Two, One]
  : never;

type ReverseArrLoop<Arr extends unknown[]> = Arr extends [
  infer First,
  ...infer Reset
]
  ? [...ReverseArrLoop<Reset>, First]
  : Arr;

type ReverseArrRes = ReverseArr<arr>;
type ReverseArrRes2 = ReverseArrLoop<arr>;

// include
type IsEqual<A, B> = (A extends B ? true : false) &
  (B extends A ? true : false);
type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false;

type IncludesRes = Includes<[1, 2, 3, 4, 5], 5>;
type IncludesRes2 = Includes<[1, 2, 3, 4, 5], 25>;

// remove item
type RemoveItem<
  Arr extends unknown[],
  Item,
  Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result;
type RemoveItemRes = RemoveItem<[1, 2, 3, 4, 5], 5>;

// 数组的构造
//  Arr["length"] extends Length 长度的比较
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;
type BuildArrayRes = BuildArray<5, "a">;

// replaceStr
type replaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;

type replaceStrRes = replaceStr<"abccccdefg", "c", "d">;

type replaceStrLoop<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${replaceStrLoop<Suffix, From, To>}`
  : Str;
type replaceStrRes2 = replaceStrLoop<"abccccdefg", "c", "d">;

// StringToUnion
type StringToUnion<Str extends string> =
  Str extends `${infer One}${infer Two}${infer Three}${infer Four}`
    ? One | Two | Three | Four
    : never;

type StringToUnionRes = StringToUnion<"abcd">;

type StringToUnion2<Str extends string> =
  Str extends `${infer One}${infer Rest}` ? One | StringToUnion2<Rest> : never;
type StringToUnionRes2 = StringToUnion2<"abcdefg">;

// reverse str
type ReverseStr<
  Str extends string,
  Result extends string = ""
> = Str extends `${infer First}${infer Rest}`
  ? ReverseStr<Rest, `${First}${Result}`>
  : Result;

type reverseStrRes = ReverseStr<"abcdefg">;

// deep readonly
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
type obj = {
  a: {
    b: {
      c: {
        f: () => "dong";
        d: {
          e: {
            guang: string;
          };
        };
      };
    };
  };
};
type DeepReadonly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object
    ? Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadonly<Obj[Key]>
    : Obj[Key];
};

type DeepReadonlyRes = DeepReadonly<obj>;

type DeepReadonlyResult = DeepReadonly<obj>["a"];

type DeepReadonlyResult2 = DeepReadonly<obj>["a"]["b"]["c"];
type DeepReadonlyResult3 = DeepReadonly<obj>["a"]["b"]["c"]["d"];

type RemoveItem2<Arr extends unknown[], Item> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, Item> extends true
    ? RemoveItem2<Rest, Item>
    : [First, ...RemoveItem2<Rest, Item>]
  : Arr;
