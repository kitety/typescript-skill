// 条件：extends ? :
type isTwo<T> = T extends 2 ? true : false;
type res = isTwo<1>;
type res1 = isTwo<2>;

// 提取类型的一部分 infer
// 推断初第一个元素的类型是T
type First<T extends unknown[]> = T extends [infer T, ...infer R] ? T : never;

type res2 = First<[1, 2, 3]>;

type Union = 1 | 2 | 3;

type ObjType = { a: number } & { c: boolean };
type fixObjType = { a: number; c: boolean } extends ObjType ? true : false;

// 映射类型就相当于把一个集合映射到另一个集合，这是它名字的由来。
type MapType<T> = {
  [Key in keyof T]?: T[Key];
};

type MapType2<T> = {
  [Key in keyof T]?: [T[Key], T[Key], T[Key]];
};
type mapTypeRes = MapType2<{ a: number; c: boolean }>;

// 值和索引都可以变
// 因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃。
type MapType3<T> = {
  [key in keyof T as `${key & string}${key & string}${key & string}`]: [
    T[key],
    T[key],
    T[key]
  ];
};
type mapTypeRes2 = MapType3<{ a: number; c: boolean }>;
