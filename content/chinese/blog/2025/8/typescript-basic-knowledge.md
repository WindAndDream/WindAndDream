---
title: "TypeScript 的基础知识"
meta_title: "前端 TypeScript 基础知识 入门 高阶"
description: "了解TypeScript的基础知识"
date: 2025-08-30T16:24:00+08:00
image: "/images/blog/2025/7/css-px-to-physical-px/cover.jpg"
categories: ["TypeScript", "前端"]
author: "清风为梦"
tags: ["TypeScript", "前端"]
math: true
draft: false
---

## 章节介绍

我相信许多从事网页开发的朋友都有被 **TypeScript** 折磨过，或者刚入行的朋友，学得有点云里雾里的。

很多时候，我们将 **JavaScript** 中的思维放到了 **TypeScript** 中，就很容易出现许多奇奇怪怪的错误。

在这篇章节中，将讲解 **TypeScript** 中的常用知识，并且尽量以通俗易懂的方式说明。

**并且我也推荐，可以将示例代码复制粘贴到你所使用的代码编辑器中，方便理解和阅读代码。**

<hr>

## 类型概念

我们从英文中都能看出， **TypeScript** 必然是围绕类型展开的，这里以最基本的类型概念入手，带大家一点一点理解。

首先，我们知道 **JavaScript** 也有类型的概念，每个对象都有一个对应的类型，但当项目逐渐庞大起来时，我们很难以肉眼判断对象类型。

而对于 **TypeScript** 来说，需要我们显式声明对象类型，提升了开发成本，但降低了维护成本。

<hr>
{{< notice "提示" >}}
以下所有示例，所用的 TypeScript 版本为 5.5.4。
{{< /notice >}}

## 类型系统基础

### 基本类型

#### string

**字符串（string）** 表示文本数据，可以使用单引号、双引号或模板字符串。

```typescript
let name: string = "Alice";
let greeting: string = `Hello, ${name}!`;
```

<hr>

#### number

**数值（number）** 支持整数、浮点数，支持十进制、十六进制、二进制和八进制。

```typescript
let age: number = 25;
let hex: number = 0x1a;
```

<hr>

#### boolean

**布尔值（boolean） ** 表示真或假，仅支持 true 和 false。

```typescript
let isActive: boolean = true;
```

<hr>

#### symbol

**符号 （symbol） ** 表示唯一且不可变的值，通常用作对象键。

当使用 **指定符号对象** 作为类型的键时，我们需要用 **const** 声明以及类型必须为 **unique symbol** 类型，因为它是全局唯一的，详细可看 **示例-2** 和 **错误示例-3** 。

```typescript
// 示例-1
let sym: symbol = Symbol("unique");

// 示例-2
const sym_1: unique symbol = Symbol("111"); // 必须为const和unique symbol类型
type SymObj_1 = { [sym_1]: number };
type SymNum_1 = SymObj_1[typeof sym_1]; // number

// 错误示例-3
const sym_2: unique symbol = Symbol("111");
// 这里会显示错误，即使字面量跟sym_1（都是Symbol("111")）一样，但由于symbol是全局唯一，必须和类型的键一一对应。
type SymNum_2 = SymObj_1[typeof sym_2];
```

<hr>

#### BigInt

**BigInt** 表示任意精度的整数。

```typescript
let big: bigint = 123456789n;
```

<hr>

#### undefined

**undefined** 表示未定义值，通常作为其他类型的子类型（非严格模式下）。

```typescript
let u: undefined = undefined;
```

<hr>

#### null

**null** 表示空值，通常作为其他类型的子类型（非严格模式下）。

```typescript
let n: null = null;
```

<hr>

#### any

**any** 表示任意类型，关闭类型检查，适用于不确定类型的场景。

```typescript
let anything: any = 42;
anything = "now a string";
```

<hr>

#### never

**never** 表示永远不可能出现的，通常出现在抛出错误的函数、死循环以及代码通常无法到达的判断中。

```typescript
// 示例-1
function throwError(): never {
  throw new Error("Error");
}

// 示例-2
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape, size: number): number {
  switch (shape) {
    case "circle":
      return Math.PI * size * size;
    case "square":
      return size * size;
    case "triangle":
      return (size * size) / 2;
    default:
      // 这里的 shape 类型会被推断为 never，因为按照声明的联合类型，理论上永远不可能到达这里。
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

<hr>

#### void

**空值（void）** 表示函数没有返回值。

```typescript
function log(): void {
  console.log("No return");
}
```

<hr>

### 数组类型

数组类型用于定义包含多个值的集合，TypeScript 提供两种等价的写法：

#### Type[]

将数组中的成员类型直接放在 **[]** 之前即可。

```typescript
let numbers: number[] = [1, 2, 3]; // 这里的类型为number

let names: string[] = ["Alice", "Bob"]; // 这里的类型为string

// 对象类型
type CustomType = {
  name: string;
  age: number;
};

let typeArr: CustomType[] = [{ name: "测试", age: 22 }];

// 接口类型
interface CustomInter {
  school: string;
  gender: string;
}

let interArr: CustomInter[] = [{ school: "aaa", gender: "男性" }];

// 数组类型
type CustomArr = string[];

let arr: CustomArr[] = [["aaa"], ["222"]];
```

#### type\<T>[]

这里的 **T** 可以称作“泛型”，简单来说，就是 **由外部传入的成员类型决定数组的类型** 。

我们需要记住，**type\<T>[]** 是等效于 **type[]** 的，二者都是数组类型。

对于泛型的理解，口头文字描述是相对抽象的，我们可以直接通过示例理解：

```typescript
type GenericArr<T> = T[]; // 我们这里定义了一个泛型数组

// 示例 - 1 由外部传入 string 类型，表示这是字符串数组
const names: GenericArr<string> = ["Mike", "John", "Bob"];

// 示例 - 2 表示数值数组
const num: GenericArr<number> = [1, 2, 3];

/**
 * 示例 - 3 表示二维字符串数组（即嵌套的数组）
 * 可能有的朋友会在这里看得有点迷糊，简单来说，就是传入一个字符串的数组作为数组中的每个成员。
 * 转动大脑思考一下，数组中的成员不是也可以为数组吗？甚至是对象、接口、函数等...
 */
const stringArr: GenericArr<string[]> = [["a", "b", "c"]];

/**
 * 示例 - 4
 * 看到这个类型时，初学者可能大脑已经宕机了，GenericArr 里面又放个 GenericArr 是什么意思？
 * 不急，首先我们回到【示例 - 1】看，可以看见 GenericArr<string> 等价于 string[] 。
 * 所以我们可以将这个类型理解为：GenericArr<string[]>，也就是和【示例 - 3】是同等的。
 */
const genericArr: GenericArr<GenericArr<string>> = [["啊哈", "哦耶", "曼波"]];

/** 这里就不再展示过多示例，我们只需要记住，泛型是通过外部传入的类型来决定内部的实现 */
```

### 对象类型

对象类型总共有三种声明方式，分别为：**Object** 、**Type**、**interface**。

#### Object

**Object** 是非常少作为类型使用的，因为它是一个非常宽泛的类型，如果你了解JS的基础，那么你一定清楚 **原型链** 。

我们首先先把原型链相关内容划分为两大板块：

{{< tabs >}}

{{< tab "原始值" >}}

- 特殊原始值：**undefined** 和 **null** 都是特殊的原始值，不参与原型链。
- 普通原始值：如：**string、number、boolean、symbol、bigint**，原型链最终会指向 **null** 。

- 解释说明：

  - 特殊原始值是不存在原型链的，所以 **Object类型** 是无法被 **null** 和 **undefined** 匹配的。

  - 普通原始值：

    1. 对基本类型进行对象方法调用时
    2. 当基本类型赋值给对象时
    3. 在属性访问中
    4. 需要上下文中的对象时
    5. 对象类型比较时
    6. 使用 **new** 关键字时

    👆 普通原始值在以上几种情况中，会触发 **自动装箱（auto-boxing）** ，可看示例理解 **自动装箱** 的含义 。

- 示例：

  ​	从文本的角度来描述过于抽象了，我们结合示例来看将会很容易理解。

  ```type
  

而在倒数第二层的原型链中，原型则指向的是 **Object**，这也就说明，除了特殊的原始值以外，其他原始值的原始对象都是以继承于 **Object** 。

站在类型的角度来看，就相当于 **Object类型** 是可以分配给其他原始值的，因为原始对象是继承于 **Object** ，拥有它的所有属性和方法！

有的

```typescript
```



{{< /tab >}}

{{< tab "对象" >}}

所有对象的原型链都会以 **null** 结束。

绝大多数对象的原型链为：`对象 → … → Object.prototype → null`。

除了一些 **特殊对象**：

- **Object.prototype**
  - `Object.prototype` 本身就是原型链的终点，因为原型链的倒数第二层就是 `Object`，相当于它的原型就是 `null`。
- **Object.create(null)**
  - `Object.create(null)` 创建了一个“纯净”的对象，不继承任何属性和方法，固然也没有原型

{{< /tab >}}

{{< /tabs >}}
