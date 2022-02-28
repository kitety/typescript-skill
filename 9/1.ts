// 联合分散可简化
// 当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。

type Union = "a" | "b" | "c";
type UppercaseA<Item extends string> = Item extends "a"
  ? Uppercase<Item>
  : Item;

type res1 = UppercaseA<Union>;
// 会把联合类型的每一个元素单独传入做类型计算，最后合并。

type strRes = `${Union}~~~`;

// CamelCaseUnion
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str;

type res2 = CamelCase<"aa_aa_aa_aa">;

// 如果是对字符串数组做 CamelCase，那就要递归处理每一个元素
type CamelCaseArr<
  Arr extends unknown[],
  Result extends unknown[] = []
> = Arr extends [infer Item, ...infer RestArr]
  ? [...Result, CamelCase<Item & string>, ...CamelCaseArr<RestArr>]
  : Result;
//   因为 CamelCase 要求传入 string，这里要 & string 来变成 string 类型。
type res3 = CamelCaseArr<["aa_aa_aa_aa", "bb_bb_bb_bb", "cc_cc_cc_cc_cc"]>;
type res4 = CamelCase<"aa_aa_aa_aa" | "bb_bb_bb_bb" | "cc_cc_cc_cc_cc">;

// 判断是不是联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;

type isUnionRes1 = IsUnion<["a", "b"]>;
type isUnionRes2 = IsUnion<"a" | "b">;

type testUnion<A, B = A> = A extends A ? { a: A; b: B } : never;
type testUnionRes1 = testUnion<"a" | "b" | "c">;
/**
 * 因为条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会。
所以 A 是 'a' 的时候，B 是 'a' | 'b' | 'c'， A 是 'b' 的时候，B 是 'a' | 'b' | 'c'
 */

type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;
// bem
type bemResult = BEM<"guang", ["aaa", "bbb"], ["warning", "success"]>;

// 转换为union
type union1 = ["aaa", "bbbb"][number];

// AllCombinations
// 希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。
type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never;
type ABres = AllCombinations<"A" | "B" | "C">;
