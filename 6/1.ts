// 重新构造做变换
// TypeScript 类型系统支持 3 种可以声明任意类型的变量： type、infer、类型参数。

// type 叫做类型别名，其实就是声明一个变量存储某个类型：
type ttt = Promise<string>;

// infer 用于类型的提取，然后存到一个变量里，相当于局部变量：
type getValueType<P> = P extends Promise<infer Value> ? Value : never;

// 类型参数用于接受具体的类型，在类型运算中也相当于局部变量：
type isTwo<T> = T extends 2 ? true : false;

// 重新构造做变换。
// Push
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];
type PushResult = Push<[1, 2, 3], 4>;

// Unshift
type UNshift<Arr extends unknown[], Ele> = [Ele, ...Arr];
type UNshiftResult = UNshift<[1, 2, 3], 4>;

// Zip
type tuple1 = [1, 2];
type tuple2 = ["mei", "li"];
// 想要的结果
// type tuple = [[1, 'guang'], [2, 'dong']];

// 其实就是分别赋值给临时变量
type Zip<
  One extends [unknown, unknown],
  Other extends [unknown, unknown]
> = One extends [infer OneFirst, infer OneSecond]
  ? Other extends [infer TwoFirst, infer TwoSecond]
    ? [[OneFirst, TwoFirst], [OneSecond, TwoSecond]]
    : []
  : [];
type ZipRes = Zip<tuple1, tuple2>;

// 如果数量是任意的 就需要用到递归了
// 去除第一个和剩余的，然后递归
type Zip2<One extends unknown[], Other extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>]
    : []
  : [];

type ZipRes2 = Zip2<[1, 2, 3, 4, 5, 6], ["a", "b", "c", "d", "e", "f"]>;
//  [[1, "a"], [2, "b"], [3, "c"], [4, "d"], [5, "e"], [6, "f"]]

// 字符串类型的重新构造
// 首字母大写
type CapitalizeStr<Str extends string> =
  Str extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : Str;

type CapitalizeStrRes = CapitalizeStr<"mei li">;

//  dong_dong_dong 到 dongDongDong
// 递归
// 剩下的放到Rest里面
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str;
type CamelCaseRes = CamelCase<"dong_dong_dong">;

// DropSubStr
// 删除字符串中的某个子字符串
type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str;

type DropSubStrRes = DropSubStr<"dong_dong_dong", "dong">;
type DropSubStrRe2s = DropSubStr<"dong_dong_dong", "d">;

// 函数的类型重新构造
// 在原来的参数中添加一个参数
type AppendArgument<Func extends Function, Arg> = Func extends (
  ...args: infer Args
) => infer ReturnType
  ? (...args: [...Args, Arg]) => ReturnType
  : never;
type AppendArgumentRes = AppendArgument<(name: string) => string, number>;

// 索引类型的重新构造
type obj = {
  name: string;
  age: number;
  gender: boolean;
};
type obj2 = {
  readonly name: string;
  age?: number;
  gender: boolean;
};

type Mapping<Obj extends object> = {
  [key in keyof Obj]: Obj[key];
};
type Mapping2<Obj extends object> = {
  [key in keyof Obj]: [Obj[key], Obj[key], Obj[key]];
};
type Mapping2Res = Mapping2<{ a: number; b: 2 }>;

// UppercaseKey 重新映射
// 因为索引可能为 string、number、symbol 类型，而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分。
type UppercaseKey<Obj extends object> = {
  [key in keyof Obj as Uppercase<key & string>]: Obj[key];
};
type Mapping3Res = UppercaseKey<{ a: number; b: 2 }>;

type MyRecord<K extends string | number | symbol, T> = { [P in K]: T };

type UppercaseKey2<Obj extends Record<string, any>> = {
  [key in keyof Obj as Uppercase<key & string>]: Obj[key];
};
type Mapping4Res = UppercaseKey2<{ a: number; b: 2 }>;

// ToReadonly
// 索引类型的索引可以添加 readonly 的修饰符，代表只读。
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
type ToReadonlyRes = ToReadonly<{ a: number; b: 2 }>;

type ToPartial<T> = {
  [Key in keyof T]?: T[Key];
};
type ToPartialRes = ToPartial<{ a: number; b: 2 }>;

type ToMutable<T> = {
  -readonly // 减去readonly
  [Key in keyof T]: T[Key];
};
type ToMutableRes = ToMutable<{ readonly a: number; b: 2 }>;

type ToRequired<T> = {
  [Key in keyof T]-?: T[Key];
};
type ToRequiredRes = ToRequired<{ a?: number; b?: 2 }>;

// 可以在构造新索引类型的时候根据值的类型做下过滤：
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  // never 的索引会在生成新的索引类型时被去掉
  // 联合类型会每个类型单独传入求值，最后把结果合并成联合类型
  [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key];
};
type FilterByValueType2<Obj extends Record<string, any>, ValueType> = {
  // Obj[Key] 和 ValueType 互相换换
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key];
};

// 生效
type FilterResult = FilterByValueType<
  { a: number; b: 2; c: string[]; d: number },
  number | string | string[]
>;
// 不生效
type FilterResult2 = FilterByValueType2<
  { a: number; b: 2; c: string[]; d: number },
  number | string | string[]
>;

type cc = number | string | string[] extends string ? true : false;

// tuple to set */写了个小方法
type tuple = [1, 2, 3];
type push<arr extends unknown[], ele> = ele extends keyof arr
  ? [...arr]
  : [...arr, ele];
type pushResult = push<tuple, 34>;
