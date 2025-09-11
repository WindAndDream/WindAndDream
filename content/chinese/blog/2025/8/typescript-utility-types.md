---
title: "常见的 TypeScript 内置工具类型"
meta_title: "前端 TypeScript 内置工具类型"
description: "介绍常见的前端TypeScript内置工具类型"
date: 2025-08-28T20:42:00+08:00
image: "/images/blog/2025/7/css-px-to-physical-px/cover.jpg"
categories: ["TypeScript", "前端"]
author: "清风为梦"
tags: ["TypeScript", "前端"]
math: true
draft: false
---

## 章节介绍

在我们使用 **TypeScript** 开发时，避免不了使用类型。

于是，这篇文章的意义就是记录一些常用的内置工具类型。

{{< notice "提示" >}}
以下所有示例，所用的 TypeScript 版本为 5.5.4。
{{< /notice >}}

<hr>



## 常用内置工具类型



## Record

<h3>介绍</h3>

构造一个对象类型，键是 **K**（通常是字符串、数字或符号的联合类型），值是 **T** 类型。

<h3>内部实现</h3>

```typescript
type Record<K extends keyof any, T> = { 
  [P in K]: T; // 创建对应K的键
}
```

<h3>示例</h3>

需要注意的是，在 **JavaScript** 中，对象（**object**）的键永远只能是 **字符串** 或者 **符号**。

所以当 **数值类型** 作为键时，会被隐式转换为字符串类型。

而当 **符号** 作为键时，如果为特定的符号对象，则我们需要注意是否为声明类型时对应的键，否则即使字面量相同，也会抛出类型不一致的错误。

```typescript
/** 示例1 - 特定的字符串值作为键 */
type Keys_1 = "a" | "b" | "c";
type MyRecord_1 = Record<Keys_1, number>; // 等价于 { a: number; b: number; c: number }

/** 示例2 - 特定的数字值作为键 */
type Keys_2 = 1 | 2 | 3;
type MyRecord_2 = Record<Keys_2, string>; // 等价于 { 1: string; 2: string; 3: string }

/** 示例3 - 宽泛的字符串类型作为键，代表任意字符串即可 */
type Keys_3 = string;
type MyRecord_3 = Record<Keys_3, string>; // 等价于 { [x: string]: string; }

/** 示例4 - 宽泛的数值类型作为键，代表任意数值即可 */
type Keys_4 = number;
type MyRecord_4 = Record<Keys_4, string>; // 等价于 { [x: number]: string; }

/** 
 * 在使用特定的符号作为键时需要注意，由于Symbol是全局唯一的，所以字面量相等也无法匹配。
 * 必须使用对应声明的符号对象作为键，否则会提示类型错误，具体实例可看：示例5-1。
 */

/* 示例5 - 特定的符号作为键 */
const symbol_5 = Symbol('5');
type Keys_5 = typeof symbol_5;
type MyRecord_5 = Record<Keys_5, string> // 等价于 { [symbol_5]: string; }

/** 示例5-1 - 额外的错误示例 */
const symbol_5_1 = Symbol('5') // 和symbol_5是相同字面量
const record_test_1: MyRecord_5 = { [symbol_5_1]: '222' }; // 这里会显示错误
const record_test_2: MyRecord_5 = { [symbol_5]: '222' }; // 这里则是正常的

/** 示例6 - 宽泛的符号类型作为键，代表任意符号即可 */
type Keys_6 = symbol;
type MyRecord_6 = Record<Keys_6, number>; // 等价于 { [x: symbol]: number; }
```

<hr>



## Pick

<h3>介绍</h3>

从类型 **T** 中挑选指定的键 **K**（K 必须是 T 的键的 **子集** ），构造新类型。

如果传入 **K** 全都不符合要求，则会返回空类型 **{ }**。

<h3>内部实现</h3>

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]; // 获取对应K的值
}
```

<h3>示例</h3>

```typescript
/** 示例1 - 获取字符串键的新类型 */
interface User_1 {
  name: string;
  age: number;
  id: number;
}
type PickedUser_1 = Pick<User_1, "name" | "age">; // 等价于 { name: string; age: number }

/** 示例2 - 获取数字键的新类型 */
interface User_2 {
  0: string;
  1: number;
  2: number;
}
type PickedUser_2 = Pick<User_2, 1 | 2>; // 等价于 { 1: number; 2: number; }

/** 示例3 - 符号类型作为键 */
interface User_3 {
  [Key_3: symbol]: string;
  1: number;
  2: number;
}
type PickedUser_3 = Pick<User_3, symbol>; // 等价于 { [x: symbol]: string; }

/** 示例4 - 具体对象作为键 */
const symbol_4 = Symbol('aa');
const number_4 = 4;
const string_4 = 'a';

interface User_4 {
  [symbol_4]: string;
  [number_4]: number;
  [string_4]: number;
}

type PickedSymbol_4 = Pick<User_4, typeof symbol_4>; // 等价于 { [symbol_4]: string; }
type PickedNumber_4 = Pick<User_4, typeof number_4>; // 等价于 { 4: number }
type PickedString_4 = Pick<User_4, typeof string_4>; // 等价于 { a: number }
```

<hr>

## Omit

<h3>介绍</h3>

从类型 **T** 中移除指定的键 **K**，构造新类型（与 Pick 相反）。

如果传入 **K** 全都不符合要求，则会返回默认的 **T**。

<h3>内部实现</h3>

```typescript
type Omit<T, K extends keyof any> = { 
  [P in Exclude<keyof T, K>]: T[P];  // 使用Exclude排除指定键
}
```

<h3>示例</h3>

```typescript
/** 示例1 - 移除字符串键的类型 */
interface User_1 {
  name: string;
  age: number;
  id: number;
}
type OmittedUser_1 = Omit<User_1, "name" | "age">; // 等价于 { id: number }

/** 示例2 - 移除数字键的类型 */
interface User_2 {
  0: string;
  1: number;
  2: number;
}
type OmittedUser_2 = Omit<User_2, 1 | 2>; // 等价于 { 0: string }

/** 示例3 - 移除符号类型作为键 */
interface User_3 {
  [Key_3: symbol]: string;
  1: number;
  2: number;
}
type OmittedUser_3 = Omit<User_3, symbol>; // 等价于 { 1: number; 2: number }

/** 示例4 - 移除具体对象作为键 */
const symbol_4 = Symbol('aa');
const number_4 = 4;
const string_4 = 'a';

interface User_4 {
  [symbol_4]: string;
  [number_4]: number;
  [string_4]: number;
}

type OmittedSymbol_4 = Omit<User_4, typeof symbol_4>; // 等价于 { 4: number; a: number }
type OmittedNumber_4 = Omit<User_4, typeof number_4>; // 等价于 { [symbol_4]: string; a: number }
type OmittedString_4 = Omit<User_4, typeof string_4>; // 等价于 { [symbol_4]: string; 4: number }
```



