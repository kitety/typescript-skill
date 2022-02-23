// 'abc'.replace(/a(b)c/,'$1,$1,$1') 'b,b,b'

type p = Promise<"test">;
type getValueType<P> = P extends Promise<infer T> ? T : never;
type getValueTypeRes = getValueType<p>;

type arr = [1, 2, 3];

type getFirst<Arr extends unknown[]> = Arr extends [infer T, ...unknown[]]
  ? T
  : never;

type getFirstRes1 = getFirst<arr>;
type getFirstRes2 = getFirst<[]>;

// 取出剩余的数组
type popArr<Arr extends unknown[]> = Arr extends []
  ? []
  : Arr extends [...infer T, unknown]
  ? T
  : never;

type popArrRes1 = popArr<arr>;
type popArrRes2 = popArr<[]>;

// 跳过第一项
type shiftArr<Arr extends unknown[]> = Arr extends []
  ? []
  : Arr extends [unknown, ...infer Rest]
  ? Rest
  : never;

type shiftArrRes1 = shiftArr<arr>;
type shiftArrRes2 = shiftArr<[]>;

// startsWith
type startsWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false;

type startsWithRes1 = startsWith<"abc", "a">;
type startsWithRes2 = startsWith<"abc", "v">;

// replaceStr
type replaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;

type replaceStrRes1 = replaceStr<"abc", "a", "v">;
type replaceStrRes2 = replaceStr<"abc", "v", "a">;

// Trim

type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
  | " "
  | "\n"
  | "\t"}`
  ? TrimStrRight<Rest>
  : Str;
type TrimStrLeft<Str extends string> = Str extends `${
  | " "
  | "\n"
  | "\t"}${infer Rest}`
  ? TrimStrLeft<Rest>
  : Str;

type TrimStrRightRes1 = TrimStrRight<"abc   ">;
type TrimStrLeftRes1 = TrimStrLeft<"   abc">;
type TrimStrRes1 = TrimStrRight<TrimStrLeft<"   abc    ">>;

// GetParameters

type GetParameters<Fn extends Function> = Fn extends (
  ...args: infer Args
) => any
  ? Args
  : never;

type getParametersRes = GetParameters<({ name: string }) => void>;

// ReturnType
type MyReturnType<Fn extends Function> = Fn extends (
  ...args: unknown[]
) => infer Return
  ? Return
  : never;
type MyReturnTypeRes = MyReturnType<() => string>;
