// 数组长度做计数

type num1 = [unknown]["length"];
type num2 = [unknown, unknown]["length"];

// TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。

type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;

type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]["length"];

type AddRes1 = Add<10, 52>;

type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest["length"]
  : never;
type SubtractRes1 = Subtract<100, 20>;

// 递归做乘法
type Multiplication<
  Num1 extends number,
  Num2 extends number,
  Result extends unknown[] = []
> = Num2 extends 0
  ? Result["length"]
  : Multiplication<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...Result]>;

type MultiplicationRes = Multiplication<100, 20>;

// 递归做除法
type Division<
  Num1 extends number,
  Num2 extends number,
  Result extends unknown[] = []
> = Num1 extends 0
  ? Result["length"]
  : Division<Subtract<Num1, Num2>, Num2, [unknown, ...Result]>;

type DivisionRes = Division<20, 4>;

// 计数
type StrLenth<
  Str extends string,
  Result extends unknown[] = []
> = Str extends `${string}${infer Rest}`
  ? StrLenth<Rest, [...Result, unknown]>
  : Result["length"];

type StringLengthRes = StrLenth<"gfhasdgfjhsdg jhgsdf">;

// GreaterThan
// 分别放入数组取长度，看谁先到达长度
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  Result extends unknown[] = []
> = Num1 extends Num2
  ? false
  : Result["length"] extends Num2
  ? true
  : Result["length"] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...Result, unknown]>;
type GreaterThanRes = GreaterThan<2, 1>;
type GreaterThanRes2 = GreaterThan<2, 10>;
type GreaterThanRes3 = GreaterThan<2, 2>;

// // Fibonacci
type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr["length"] extends Num
  ? CurrentArr["length"]
  : FibonacciLoop<
      CurrentArr,
      [...PrevArr, ...CurrentArr],
      [...IndexArr, unknown],
      Num
    >;
// // 1、1、2、3、5、8、13、21、34
type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;
type FibonacciRes = Fibonacci<6>;
/**
 * [1] [] [] 6
 * [] [1] [unknown] 6
 * [1] [1] [unknown,unknown] 6
 * [1] [1,1] [unknown,unknown,unknown] 6
 * [1,1] [1,1,1] [unknown,unknown,unknown,unknown] 6
 * [1,1,1] [1,1,1,1,1] [unknown,unknown,unknown,unknown,unknown] 6
 * [1,1,1,1,1] [1,1,1,1,1,1,1,1] [unknown,unknown,unknown,unknown,unknown,unknown] 6
 *
 */
