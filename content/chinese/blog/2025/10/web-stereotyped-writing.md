---
.title: "前端八股文"
meta_title: "前端八股文"
description: "介绍常见的前端八股文"
date: 2025-08-28T20:42:00+08:00
image: "/images/blog/2025/7/css-px-to-physical-px/cover.jpg"
categories: ["前端"]
author: "xiaogan"
tags: ["前端"]
math: true
draft: false
---

## 章节介绍

用于记录一些常见的八股文方便自己查阅

{{< notice "提示" >}}
以下文档，部分说法并非和官方命名规范一致。
{{< /notice >}}

<hr>

## JavaScript

### JS 数据类型

1. 基本类型：Boolean、Number、String、Undefined、Null、BigInt、Symbol
2. 引用类型：Object、Array、Function、Date、RegExp、Set、Map、WeakMap、WeakSet

### JS 作用域

**全局作用域（Global Scope）**
 在所有函数外部定义的变量，处于全局作用域中，整个程序都能访问。

```js
var a = 1;
function test() {
  console.log(a); // 1
}
test();
```

**函数作用域（Function Scope）**
 在函数内部定义的变量，只能在函数内部访问。

```js
function fn() {
  var x = 10;
  console.log(x); // 10
}
console.log(x); // ❌ 报错：x is not defined
```

**块级作用域（Block Scope）**（ES6 新增）
 使用 `let` 或 `const` 声明的变量，在 `{}` 内部形成独立作用域。

```js
{
  let b = 2;
}
console.log(b); // ❌ 报错
```

**作用域链（Scope Chain）**

当你访问一个变量时，JS 引擎会按照 **“由内向外”** 的规则查找变量，这个查找链路称为 **作用域链**。

```js
var a = 1;
function outer() {
  var b = 2;
  function inner() {
    var c = 3;
    console.log(a, b, c); // 1, 2, 3
  }
  inner();
}
outer();

// 查找过程：
// 查找 c：在 inner() 作用域中找到；
// 查找 b：没找到 → 去上层 outer() 作用域；
// 查找 a：再没找到 → 去全局作用域；
// 找不到 → 报错 ReferenceError。
```

**词法作用域（Lexical Scope）**

JavaScript 是一种 **词法作用域语言（静态作用域）**。
 也就是说，**作用域在代码定义时就已经决定，而不是在运行时决定的。**

例子：

```js
var a = 1;
function foo() {
  console.log(a);
}
function bar() {
  var a = 2;
  foo(); // 输出 1，而不是 2
}
bar();
```

解释：

- `foo()` 在定义时，记录了自己的外层作用域是“全局”；
- 无论在谁那里调用，它都按定义时的作用域去找 `a`；
- 所以输出 `1`。

**执行上下文（Execution Context）**

每次函数执行时，都会创建一个 **执行上下文**，其中包含：

- 当前函数的作用域；
- 变量、函数声明；
- `this` 指向；
- 外层作用域引用（形成作用域链）。

执行顺序：

1. 创建阶段：确定作用域链、创建变量对象、确定 this。
2. 执行阶段：变量赋值、代码执行。

**闭包与作用域的关系**

**闭包（Closure）** 本质上是作用域链的产物。
 当一个内部函数引用了外部函数的变量时，即形成闭包。

```js
function createCounter() {
  let count = 0;
  return function() {
    count++;
    console.log(count);
  };
}
const counter = createCounter();
counter(); // 1
counter(); // 2
```

内部函数始终保留了对 `createCounter()` 作用域的引用，这就是闭包的核心。



### JS 闭包

概念：闭包 = 函数 + 创建时的词法环境（外部变量的引用）。

```js
function makeCounter() {
  let count = 0; // 外部变量
  return function () {
    // 返回的函数就是闭包
    count++;
    return count;
  };
}

const c = makeCounter();
console.log(c()); // 1
console.log(c()); // 2
// 调用 makeCounter() 时创建了一个执行上下文，count 存在于这个上下文中。
// 返回的函数内部仍引用 count，这个引用会把 count 的环境保留在内存中。
```

### call、apply()、bind() 的区别

共同点：都是是在 **Function.prototype** 上的方法
作用：改变函数内部的 **this** 指向（箭头函数没有自己的 **this** ）

| 特性         | call()   | apply()                 | bind()           |
| ------------ | -------- | ----------------------- | ---------------- |
| 改变this     | ✅       | ✅                      | ✅               |
| 是否立即执行 | ✅       | ✅                      | ❌（返回新函数） |
| 参数格式     | 逗号分隔 | 数组                    | 逗号分隔         |
| 常用场景     | 简单调用 | 参数数组（如 Math.max） | 延迟或事件绑定   |

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}
const person = { name: "Alice" };

greet.call(person, "Hello", "!");
// 输出：Hello, Alice!
// 立即执行
// 参数依次传入

greet.apply(person, ["Hi", "..."]);
// 输出：Hi, Alice...
// 立即执行
// 参数用数组传入

const boundFn = greet.bind(person, "Hey");
boundFn("?");
// 输出：Hey, Alice?
// 不会立即执行
// 返回一个新函数（可重复使用）
```

<br />

### this指向

| 情况                     | this指向                         |
| ------------------------ | -------------------------------- |
| 普通函数调用             | 全局对象（严格模式下 undefined） |
| 对象方法调用             | 调用对象                         |
| 显式绑定 call/apply/bind | 显式传入的对象                   |
| 构造函数 new             | 新创建的对象                     |
| 箭头函数                 | 定义时的外层作用域（词法继承）   |

```javascript
// 默认绑定
function foo() {
  console.log(this);
}
foo(); // 浏览器下输出 window，严格模式下 undefined

// 隐式绑定
const obj = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // Alice

// 显式绑定
function sayHi() {
  console.log(this.name);
}
const obj = { name: "Bob" };
sayHi.call(obj); // Bob
sayHi.apply(obj); // Bob
const boundFn = sayHi.bind(obj);
boundFn(); // Bob

// new 绑定
function Person(name) {
  this.name = name;
}
const p = new Person("Tom");
console.log(p.name); // Tom

// 箭头函数特殊的this
const obj = {
  name: "Alice",
  say: () => {
    console.log(this.name);
  },
};
obj.say();
// undefined，因为箭头函数的 this 指向外层作用域（通常是全局）

// 简说-箭头函数的 this 就继承自包裹的那个“外层函数（如果是箭头则继续往外找）”的 this，如下：
// greet函数的this指向obj.greet()调用时的对象
const obj = {
  name: "Alice",
  greet() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};
obj.greet(); // Alice

function outer() {
  console.log("this1", this);
  return function () {
    console.log("this2", this);
    return () => {
      console.log("this3", this);
    };
  };
}
const obj = { fn: outer };
obj.fn()()();
// 结果：在浏览器非严格状态下，this1指向obj，this2和this3指向window
// 因为this2是在普通函数下，而this3继承自最近的外层函数function下，所以指向的也是window
```

<br />

### 手写节流和防抖

```javascript
// 防抖函数
function Debounce(fn, t) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // 箭头函数没有自己的this，所以需要改变this指向（同时利用apply数组参数的特性）
      fn.apply(this, arg);
    }, t);
  };
}

function onClick(name = "默认") {
  console.log("点击了:", name);
}

const getClick = Debounce(onClick, 1000);
getClick("张三");
getClick("李四");
const obj = {
  name: "Alice",
  click: Debounce(function () {
    console.log(this.name);
  }, 500),
};
obj.click(); // 延迟 500ms 打印 "Alice"

// 节流函数
function throttle(fn, t = 1000) {
  let timer;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      clearTimeout(timer);
      timer = null;
    }, t);
  };
}

const nextTo = () => {
  console.log("下一张");
};

const click = throttle(nextTo, 2000);

document.getElementById("btn").onclick = click;
```

<br />

### 手写数组的 Map 方法

主要考察 **原型链** 以及对 **map** 的理解

```javascript
const list = [1, 2];
let a = list.map((item, index, arr) => {
  return item + arr.length;
});
console.log(a);

Array.prototype.MyMap = function (fn) {
  // 判断fn是否函数
  if (typeof fn != "function") {
    throw "传入的不是一个回调函数";
  }
  let res = [];
  for (let index = 0; index < this.length; index++) {
    const element = this[index];
    res.push(fn(element, index, this));
  }
  return res;
};

let b = list.MyMap((item, index, arr) => {
  return item + arr.length;
});
console.log(b);
```

<br />

### 手写 Promise.all 方法

主要考察你对 **异步执行** 和对 **Promise** 的理解

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise((resolve) => setTimeout(() => resolve(3), 1000));
const p4 = Promise.reject("出错了");

function myPromiseAll(arr) {
  if (!Array.isArray(arr)) {
    return Promise.reject(new TypeError("传入的参数不是一个数组"));
  }
  return new Promise((resolve, reject) => {
    let res = []; // 返回结果数组
    if (arr.length === 0) return resolve([]);
    let index = 0; // 索引
    arr.forEach(async (item) => {
      Promise.resolve(item)
        .then((value) => {
          res[index] = value;
          index++;
          if (index === arr.length) {
            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}
Promise.myPromiseAll = myPromiseAll;

Promise.myPromiseAll([p1, p2, p3]).then((res) => {
  console.log(res);
});

Promise.myPromiseAll([p1, p4, p3])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

### 实现一个并发任务执行器

<br />

### JavaScript 中数组的常用方法

```tex
push()尾部添加

pop()尾部删除

shift()头部删除

unshift()头部添加

concat()合并数组

join()数组转字符串

slice()截取数组

splice()删除/添加数组元素

sort()排序

reverse()反转数组

indexOf()查找元素索引

forEach()遍历数组

map()遍历数组

filter()过滤数组

every()判断数组元素是否都满足条件

some()判断数组元素是否有一个满足条件

reduce()累加器

find()查找数组元素
```

## 工程化

### 除了 cdn 引入如何解决 echarts 包过大的问题？

### Webpack 和 Vite 的区别

**Webpack 打包工具（Bundler）**，主要作用是把各种资源（JS、CSS、图片、字体等）打包成浏览器可用的静态文件。

支持模块化（CommonJS、ESM、AMD）。

功能：

- 代码分割（Code Splitting）
- 模块热更新（HMR，Hot Module Replacement）
- Tree-shaking（去掉未使用代码）
- loader & plugin 系统处理各种资源

优点：

- 功能丰富、插件生态成熟
- 可以处理各种复杂场景

缺点：

- 配置复杂
- 构建速度慢（尤其是大型项目）

**Vite 下一代前端构建工具（Build Tool + Dev Server）**，由 Evan You（Vue 作者）主导开发。

核心思想：**利用浏览器原生 ESM（ES Module）+ 按需编译**，减少打包的开销。

特点：

- 开发模式下：**即时启动，无需完整打包**，利用原生 ES 模块按需加载文件。
- 构建生产模式：底层使用 **Rollup** 打包。
- 内置 HMR，启动快，更新快。

优点：

- 开发体验极佳，冷启动速度几乎秒开
- 简单配置，开箱即用
- 支持现代 JS 特性

缺点：

- 插件生态不如 Webpack 丰富
- 对老旧浏览器（IE11）支持有限



### npm 和 pnpm 区别

`npm` 和 `pnpm` 都是 **Node.js 的包管理器**，用于安装依赖、运行脚本、管理版本。
但它们在 **依赖安装机制、性能、磁盘占用、版本锁定** 等方面有显著区别。

| 对比项                           | npm                             | pnpm                             |
| -------------------------------- | ------------------------------- | -------------------------------- |
| **依赖存储方式**                 | 复制每个项目一份（冗余大）      | 使用内容寻址存储（去重节省空间） |
| **磁盘占用**                     | 大，多个项目重复依赖会重复安装  | 小，依赖共用同一个全局 store     |
| **安装速度**                     | 慢                              | 🚀 更快（软链接+缓存）           |
| **依赖解析机制**                 | 扁平化（node_modules 扁平结构） | 严格隔离（符号链接结构）         |
| **防止幽灵依赖（phantom deps）** | ❌ 容易出现                     | ✅ 完全禁止                      |
| **monorepo 管理**                | 支持但配置复杂                  | ✅ 原生支持（pnpm workspaces）   |
| **锁文件**                       | `package-lock.json`（JSON）     | `pnpm-lock.yaml`（YAML，更清晰） |

#### npm 的结构

每个项目的 `node_modules` 都独立安装所有依赖，
即使版本相同，也要重复下载与存储。

```tex
projectA/node_modules/react
projectB/node_modules/react
```

→ 导致 **磁盘浪费 + 安装慢**。

#### pnpm 的结构（关键优势）

pnpm 会在用户目录下创建一个全局的 **store 仓库**：

```tex
C:\Users\<user>\AppData\Local\pnpm-store\
```

每个项目的 `node_modules` 不再存放真实包文件，
而是 **符号链接（symlink）** 指向全局缓存。

```tex
projectA/node_modules/react -> C:\Users\<user>\AppData\Local\pnpm-store\react@18.2.0
projectB/node_modules/react -> 同上
```

✅ 优点：

- 不重复下载相同版本；
- 节省磁盘空间；
- 安装极快（只建立链接）；
- 保证依赖隔离不混乱。

#### 防止“幽灵依赖”（pnpm 的强优势）

> 幽灵依赖：项目能访问到未声明在 `package.json` 里的包。

在 npm 中可能这样：

```txt
npm install axios
```

然后代码里用：

```txt
import lodash from 'lodash'; // 即使没安装也可能能用（因为其他包依赖了它）
```

✅ pnpm 严格隔离：
未显式安装的包无法直接引用（直接报错）。
👉 有助于保证依赖关系干净、可控。

#### Monorepo（多包项目）支持

`pnpm` 内置 **workspace** 功能，非常适合管理多包项目：

```txt
pnpm init
pnpm add -w -D typescript # 添加到根依赖
```

`pnpm-workspace.yaml`：

```txt
packages:
  - 'packages/*'
  - 'apps/*'
```

✅ 优点：

- 子包间依赖共享；
- 改动同步；
- 构建加速。

而 `npm` 需要额外工具（如 `lerna`、`nx`）才能实现类似功能。

<br />

## 网络模块

### 跨域

#### 什么是跨域

**跨域（Cross-Origin）** 指的是浏览器出于**安全策略（同源策略 Same-Origin Policy）**的限制，
**禁止网页在某个源（Origin）下去请求另一个源的资源**。

#### 为什么会有跨域限制

这是浏览器为了安全设计的一个机制（**Same-Origin Policy，同源策略**）。

目的：

> 防止恶意网站通过脚本偷偷读取另一个网站的敏感信息（如 Cookie、LocalStorage、响应数据）。

⚠️ 注意：
跨域**只存在于浏览器端**，
Node.js、Postman、curl、后端之间请求**没有跨域问题**。

#### 哪些行为会触发跨域？

常见跨域场景包括：

| 行为                                  | 是否会跨域                     |
| ------------------------------------- | ------------------------------ |
| `<img src="http://xxx.com/xx.jpg">`   | ❌ 不算跨域（浏览器允许）      |
| `<script src="http://xxx.com/xx.js">` | ❌ 不算跨域（允许跨域加载 JS） |
| Ajax 请求（XMLHttpRequest / fetch）   | ✅ 会被限制                    |
| WebSocket 连接                        | ✅ 可能跨域但一般服务端可控制  |
| iframe 访问不同域的内容               | ✅ 被限制                      |

#### 跨域本质

跨域是：

> 浏览器在发送请求时可以发出去，但当响应返回时，**浏览器阻止前端代码访问响应内容**。

即：

- 请求能发出 ✅
- 响应能返回 ✅
- 但 JavaScript 拿不到响应数据 ❌

#### 跨域常见解决方案

1. OCRS（跨域资源共享）推荐

   ```tex
   服务器通过设置 响应头 来告诉浏览器哪些域可以访问资源。

   Access-Control-Allow-Origin: https://www.a.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Allow-Credentials: true

   Access-Control-Allow-Origin: * 表示允许所有域访问。
   如果前端要携带 cookie，则不能用 *，必须写具体域名。

   // 服务端示例
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', 'https://www.a.com');
     res.header('Access-Control-Allow-Credentials', 'true');
     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
   });

   // 前端示例
   fetch('https://api.b.com/data', {
     credentials: 'include', // 携带 cookie
   });
   ```

2. JSONP（老方案，仅支持 GET）

   ```tex
   // 前端
   function handle(data) {
     console.log(data);
   }
   <script src="http://api.b.com/data?callback=handle"></script>

   handle({ name: "张三", age: 20 });
   缺点：只能用于 GET 请求，已过时。
   ```

3. 代理转发（常见开发方式）

   ```tex
   前端和代理服务器同源，代理再去请求后端，而服务器与服务器之间是不会出现跨域请求的。

   // vite.config.js
   export default {
     server: {
       proxy: {
         '/api': {
           target: 'https://api.b.com',
           changeOrigin: true,
           rewrite: path => path.replace(/^\/api/, '')
         }
       }
     }
   };
   ```

4. Nginx 反向代理

   ```tex
   server {
     listen 80;
     server_name www.a.com;

     location /api/ {
       proxy_pass https://api.b.com/;
     }
   }

   浏览器访问 www.a.com/api/...
   Nginx 代理到 api.b.com，同样规避跨域。
   ```

5. postMessage（iframe通信）

   ```tex
   如果确实需要在不同域之间通信（如主页面与 iframe），可以使用：

   // 子页面
   window.parent.postMessage('hello', 'https://www.a.com');

   // 父页面
   window.addEventListener('message', (e) => {
     console.log(e.data); // hello
   });

   ```

6. 预检请求（Preflight Request）

   ```tex
   当 CORS 请求中满足以下任意条件时，浏览器会自动发一个 OPTIONS 请求 进行“预检”：
   方法不是 GET/POST/HEAD；
   请求头包含自定义字段；
   Content-Type 不是 application/x-www-form-urlencoded, multipart/form-data, text/plain。
   
   服务端要允许 OPTIONS：
   if (req.method === 'OPTIONS') {
     res.sendStatus(204); // 直接放行
   }
   
   *** 满足预检请求 ***
   1.发送预检请求
   2.预检请求抵达询问服务器是否允许
   3.预检请求通过则会发出真正的请求，并且执行后端代码，最后进行数据处理的返回，否则请求拦截失败
   4.浏览器收到响应，如果响应头缺少Access-Control-Allow-Origin等字段，浏览器会拦截响应，不让JS拿到结果
   ```

<br />

### http1 和 http2 的区别

| 对比项                        | HTTP/1.1                                                        | HTTP/2                                      |
| ----------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| **传输方式**                  | 基于文本协议（Plain Text）                                      | 基于二进制协议（Binary Framing）            |
| **连接复用**                  | 一个请求占用一个 TCP 连接（即使开启 keep-alive 也只能串行发送） | 一个 TCP 连接可同时处理多个请求（多路复用） |
| **请求队头阻塞**              | 存在（一个请求慢会卡住后面的）                                  | 几乎消除（流独立传输）                      |
| **Header 压缩**               | 无压缩，每次都重复发送                                          | 使用 HPACK 压缩头部，大幅减少体积           |
| **服务端推送（Server Push）** | 不支持                                                          | 支持（可提前推送资源）                      |
| **安全性**                    | 可用明文 HTTP 或 HTTPS                                          | 实际上几乎都基于 TLS（HTTPS）实现           |
| **性能优化手段**              | 需要合并文件（如 CSS Sprite、合并 JS/CSS）来减少请求数          | 不再需要合并，HTTP/2 多路复用能高效并发     |
| **并发连接数限制**            | 浏览器一般限制同域 6 个连接                                     | 1 个连接即可传输所有请求                    |

## TypeScript

### interface 和 type 的区别

相同点

1. 描述对象的结构；

2. 为函数、类、数组定义类型；

3. 可以被类型别名或接口继承或实现；

4. 可以互相兼容（大多数情况下可以互换）。

   ```typescript
   interface User {
     name: string;
     age: number;
   }
   
   type UserType = {
     name: string;
     age: number;
   };
   ```

不同点

| 特性                                | `interface`                        | `type`                                             |
| ----------------------------------- | ---------------------------------- | -------------------------------------------------- |
| **定义方式**                        | 专门用于定义对象的结构             | 可以定义任何类型（基本类型、联合类型、交叉类型等） |
| **可扩展性（继承）**                | ✅ 可以通过 `extends` 扩展多个接口 | ✅ 可以通过交叉类型 `&` 实现类似继承效果           |
| **声明合并（Declaration Merging）** | ✅ 可以多次声明同名接口，自动合并  | ❌ 不支持重复声明同名类型                          |
| **类型表达能力**                    | 限于对象结构、类、函数             | 更通用，可表达联合、条件、映射等高级类型           |
| **推荐场景**                        | 定义对象结构、类的契约             | 定义复杂类型组合、工具类型                         |

```typescript
// ======== 定义对象 ========
interface Person {
  name: string;
}
type PersonType = {
  name: string;
};

// ======== interface 继承和 type 交叉 ========
interface Person {
  name: string;
}
interface Student extends Person {
  grade: number;
}
type PersonType = { name: string };
type StudentType = PersonType & { grade: number };

// ======== 声明合并 ========
interface Box {
  height: number;
}
interface Box {
  width: number;
}
// 合并结果：{ height: number; width: number }
const b: Box = { height: 10, width: 20 };
type Box = { height: number };
type Box = { width: number }; // ❌ 报错：重复定义
```

## Vue

### DOM 与 虚拟 DOM

> DOM（Document Object Model）是浏览器中用于表示页面结构的对象模型。

比如：

```html
<div id="app">
  <p>Hello</p>
</div>
```

在浏览器中会被解析成一棵 DOM 树：

```txt
Document
└── div#app
    └── p
        └── "Hello"
```

每次我们修改 DOM 节点（比如 `innerHTML`、`style` 等），浏览器都要：

1. 重新计算样式（Recalculate Style）
2. 重新布局（Layout / Reflow）
3. 重新绘制（Paint）

这些过程代价很高，频繁操作 DOM 会 **造成性能问题**。

> **虚拟 DOM（Virtual DOM）是一种用 JavaScript 对象来描述真实 DOM 的抽象层。**

可以理解为：

> “在内存中用 JS 模拟 DOM 结构”。

例如真实 DOM：

```html
<div id="app">
  <p>Hello</p>
</div>
```

虚拟 DOM 表示为 JS 对象：

```javascript
const vnode = {
  tag: "div",
  props: { id: "app" },
  children: [{ tag: "p", children: ["Hello"] }],
};
```

这就是“虚拟”的意思 —— 它不是浏览器真正的节点，而是**一个用来描述它的 JS 对象**。

直接操作 DOM 很慢：

- 浏览器需要频繁渲染；
- 手动控制更新复杂、容易出错；
- 一旦数据变化，更新逻辑难以维护。

虚拟 DOM 帮你做了两件事：

1. **用数据生成虚拟 DOM 树（render 过程）**
2. **比较新旧虚拟 DOM 树的差异（diff）并最小化地更新真实 DOM**

假设数据变化：

```javascript
const data = { message: "Hello" };
```

初次渲染：

```javascript
render(data); // 生成虚拟DOM树A -> 渲染到真实DOM
```

数据更新：

```javascript
data.message = "Hi";
render(data); // 生成虚拟DOM树B
```

框架会比较两棵树的差异：

```html
A:
<p>Hello</p>
B:
<p>Hi</p>

1️⃣ 创建（Render） 根据数据生成虚拟DOM树 2️⃣ Diff 比较 比较新旧虚拟DOM树差异 3️⃣
Patch 更新 只在真实DOM中应用差异
```

只更新差异部分（即文本节点 `Hello` → `Hi`），
而不是重新渲染整个页面。

### Vue2 和 Vue3 的区别

#### 一、源码优化

1. **更小的包体积**
   Vue 3 重构源码，采用模块化设计，移除不常用功能模块，并支持按需导入，整体包体积显著小于 Vue 2（import Vue from 'vue';）（import { reactive, ref, computed } from 'vue'）。
2. **响应式系统重写**
   使用 `Proxy` 替代 `Object.defineProperty` 实现响应式，支持动态属性、数组索引和嵌套对象追踪，性能与灵活性大幅提升。
3. **Tree Shaking 支持**
   Vue 3 模块化架构完全支持 Tree Shaking，生产环境中未使用的特性会被自动移除，进一步减小打包体积。
4. **编译器优化**
   Vue 3 编译器支持静态节点提升与模板编译优化，减少运行时计算开销，提升整体渲染性能。

---

#### 二、性能优化

1. **更高效的虚拟 DOM 与 diff 算法**
   Vue 3 的虚拟 DOM 与 diff 算法经过重构，能更精准追踪依赖关系，显著减少不必要的组件更新和 DOM 操作。
2. **静态节点提升（Hoist Static）**
   编译阶段标记并缓存静态内容，避免重复渲染，提高渲染速度。
3. **响应式性能提升**
   新的 Proxy 响应式系统在大数据量或深层嵌套对象场景下，性能优于 Vue 2 的 defineProperty 实现。
4. **新增异步与布局优化能力**
   - **Suspense**：用于优雅地处理异步组件加载。
   - **Teleport**：允许组件渲染到 DOM 的任意位置。
     这些新特性让复杂场景下的渲染和布局更高效灵活。

---

#### 三、语法与 API 优化

1. **Composition API**
   新增 `setup()`、`ref()`、`reactive()` 等函数式 API，使逻辑组织更灵活、复用性更高，更适合中大型项目。
2. **TypeScript 原生支持**
   Vue 3 以 TypeScript 重写，类型推断与代码提示更完善，便于大型项目开发与维护。
3. **v-model 改进**
   支持同一组件使用多个 `v-model`，并可自定义绑定的 prop 与事件名，组件交互更灵活。
4. **Fragment 支持**
   允许组件返回多个根节点，消除了 Vue 2 需添加无意义包裹元素的限制。
5. **自定义指令增强**
   指令钩子更加简洁统一，扩展性更强，便于实现复杂交互逻辑。

### Vue2 和 Vue3 的生命周期

```tex
beforeCreate
created
beforeMount
mounted
beforeUpdate
updated
beforeDestroy
destroyed

创建阶段：
beforeCreate (已合并进 setup)
created (已合并进 setup)
onBeforeMount
onMounted
更新阶段：
onBeforeUpdate
onUpdated
卸载阶段：
onBeforeUnmount
onUnmounted
错误捕获：
onErrorCaptured
onRenderTracked / onRenderTriggered（调试专用）

```

### pinia 和 vuex 的区别

#### 1. 核心概念差异

- **Vuex**：有严格的模块化结构，核心概念包括 `State`、`Getter`、`Mutation`（同步操作）、`Action`（异步操作）、`Module`（模块拆分）。
  - 必须通过 `Mutation` 来修改状态（遵循 "单向数据流" 原则）
  - 复杂的模块嵌套可能需要使用 `namespace` 命名空间
- **Pinia**：简化了概念，只有 `State`、`Getter`、`Action`，移除了 `Mutation` 和 `Module`：
  - 可以直接在 `Action` 中处理同步和异步操作
  - 每个 store 本身就是一个模块，无需额外的 `Module` 配置
  - 代码简洁，模块拆分，主要面向vue3

### Vue 中key的作用

在 **Vue（包括 Vue 2 和 Vue 3）** 中，`key` 是一个非常重要的特殊属性，主要用于 **高效地更新虚拟 DOM（Virtual DOM）**，帮助 Vue **正确识别哪些节点被修改、复用或移除**。

> 简单来说：**`key` 是虚拟 DOM 的唯一标识，用来帮助 Vue 快速地对比新旧节点（diff算法）**

在 Vue 的渲染过程中，当数据更新时，Vue 会执行「**虚拟 DOM diff**」来决定哪些部分需要真正更新到页面上。

- 如果没有 `key`，Vue 会**尽量复用已有的 DOM 节点**，以减少创建和销毁 DOM 的开销；
- 如果有 `key`，Vue 会**根据 key 判断节点是否相同**，从而**更精准、更高效地更新界面**。

**没有 key（默认行为）**

```tex
list = ['A', 'B', 'C']  → 更新为 → ['B', 'A', 'C']
```

- Vue 会认为第一个 `<li>` 只是从 `'A'` 变成 `'B'`（而不是一个新节点）
- 所以它只是**替换内容**，不会重新创建 `<li>`

结果：
节点内容对了，但**可能导致状态错乱**（例如输入框值、动画状态、组件内部状态等被复用错误）

**有 key（推荐做法）**

```tex
<ul>
  <li v-for="item in list" :key="item">{{ item }}</li>
</ul>
```

- Vue 会根据 `key` 来识别每个节点；
- 发现 `'A'` 和 `'B'` 的 `key` 不同，会**正确移动**节点位置或重新创建。

结果：
组件状态、DOM 状态都不会错乱，更新逻辑更可靠。

**❌ 使用索引当 key**

```tex
<li v-for="(item, index) in list" :key="index">{{ item }}</li>
```

- 当列表元素顺序变化时，`index` 会变，但 DOM 会被错误复用；
- 会导致如输入框、动画状态、组件内部数据错乱。

### vue 中为什么v-if和v-for不能同时写

Vue3 中**v-if 优先级高于 v-for**，而 Vue2 **相反**

Vue 中 `v-for` 的优先级高于 `v-if`。这意味着：

- vue2 会先遍历**所有列表项**，然后再对每个项执行 `v-if` 判断
- 即使某些项会被 `v-if` 过滤掉，这些项的遍历过程仍然会执行
- 造成性能浪费，推荐通过计算属性过滤数据以及外层v-if判断
- Vue 3 ：`v-if` 会先判断条件，再决定是否执行 `v-for`。此时如果 `v-if` 中使用了 `v-for` 的迭代变量（如 `item`），会直接报错（因为变量还未定义）。

### Vue 路由原理

> 通过监听 URL 的变化（但不刷新页面），动态地切换组件，实现单页面应用（SPA, Single Page Application）的“伪跳转”效果。

#### 一、Vue Router 是什么

Vue Router 是 Vue 官方提供的前端路由管理器，支持两种主要模式：

1. **Hash 模式（默认）** —— 基于 URL 的 `#`（哈希）实现；
2. **History 模式** —— 基于 HTML5 的 `History API`（`pushState` / `replaceState`）。

#### 二、核心原理概述

无论哪种模式，本质都是：

- **监听 URL 变化（hash 或 history）**
- **解析当前 URL**
- **渲染对应组件（即更新视图）**

```tex
URL 变化 → 路由解析 → 组件切换
```

#### 三、Hash 模式原理（`#/`）

1. URL 形式

```txt
http://example.com/#/home
```

`#` 后面的内容（hash）不会被浏览器发送到服务器，因此不会导致页面刷新。

2. 关键点

- 利用浏览器的 `hashchange` 事件。
- 当 `window.location.hash` 变化时，触发回调函数。
- Vue Router 内部根据 hash 对应的路由规则渲染不同组件。

#### 四、History 模式原理（`/home`）

1. URL 形式

```txt
http://example.com/home
```

没有 `#`，看起来更“正常”。
依赖 HTML5 的 `history.pushState()`、`replaceState()` 和 `popstate` 事件。

2. 关键点

- 调用 `history.pushState()` 改变 URL，但不会刷新页面。
- 用户点击前进/后退按钮时，会触发 `popstate` 事件。
- Vue Router 拦截 `<a>` 链接点击，防止浏览器默认跳转。

### Vue 除了 watch 能监听数组变化，还有哪些方法可以监听数组的变化？

#### 1. 使用 computed 计算属性依赖数组

如果你想监听数组的整体变化（包括长度、内容），可以通过计算属性来间接监听：

```javascript
computed: {
  arrayLength() {
    return this.items.length; // 当数组长度变化时会触发
  },
  arrayContent() {
    return JSON.stringify(this.items); // 当数组内容变化时触发
  }
}
```

👉 优点：性能高，不用深度监听。
👉 缺点：JSON.stringify 有性能损耗，不适合超大数组。

#### 2. 使用 Vue.set / this.$set 手动触发响应

如果是直接修改索引的情况，例如：

```javascript
this.items[1] = "new value"; // ❌ 不会触发更新
```

应改成：

```javascript
this.$set(this.items, 1, "new value"); // ✅ 会触发更新
```

或者在 Vue 3：

```javascript
Vue.set(this.items, 1, "new value");
```

👉 原理：Vue 2 无法检测到通过索引赋值的变化，$set 手动通知 Vue 响应式系统。

#### 3. 拦截数组方法（如 push/splice 等）

Vue 2 内部其实已经对这些方法做了“代理增强”，但你也可以自定义封装监听：

```javascript
const arr = this.items;
const originalPush = arr.push;
arr.push = function (...args) {
  console.log("Array changed:", args);
  return originalPush.apply(arr, args);
};
```

#### 4. 使用 reactive + effect / watchEffect

Vue 3 通过 Proxy 自动追踪依赖，你可以用 watchEffect 来实现更灵活的监听：

```javascript
import { reactive, watchEffect } from "vue";
const items = reactive([1, 2, 3]);
watchEffect(() => {
  console.log("数组变化:", items);
});
```

#### 5. 使用 computed 依赖数组内容

类似 Vue 2 的计算属性思路：

```javascript
const list = reactive([1, 2, 3]);
const listString = computed(() => JSON.stringify(list));
watch(listString, () => {
  console.log("数组变化了");
});
```

👉 自动感知 push、splice、索引赋值等所有变化。

#### 6. 使用 Proxy 手动封装自定义监听

如果你希望在 Vue 响应式系统外自定义逻辑，也可以手动用 Proxy：

```javascript
const arr = [1, 2, 3];
const proxyArr = new Proxy(arr, {
  set(target, key, value) {
    console.log(`数组键 ${key} 被修改为 ${value}`);
    target[key] = value;
    return true;
  },
});

proxyArr.push(4);
proxyArr[1] = 99;
```

👉 适合在 Vue 外部环境或调试中使用。

#### Vue 响应式条件

1. 函数中用到的数据（读取到了某个属性）
2. 读取的对象是响应式的
3. 哪些函数（被监控函数）

   vue2：Watcher

   vue3：effect

   render、watchEffect、watch、computed

<!-- ## 场景题

### 瀑布流实现方式

### 虚拟滚动

#### 基础版虚拟滚动

#### 不定高虚拟滚动

### 假设页面白屏了，你会从什么方面入手解决问题？

### 图片懒加载

常见方式有浏览器原生（`loading="lazy"`）和 JS 的 `IntersectionObserver`（可结合 vue 的**自定义指令**）

### SPA 单页面优化

一、性能优化
1.按需加载：使用 Webpack,vite 等构建工具进行代码分割，将应用分成多个小的代码块（chunks），只在需要时加载。这可以显著减少初始加载时间。
路由懒加载
2.服务端渲染（SSR）：使用 Nuxt.js（Vue）、Next.js（React）等框架进行服务端渲染，将部分页面在服务端生成，这样用户首次访问时可以获得更快的页面加载速度，且对 SEO 友好。
3.缓存和服务工作者（Service Workers）:
缓存静态资源: 使用 Service Workers 缓存静态资源（如 CSS、JS、图片），使应用可以在离线模式下工作，提升加载速度。
预缓存关键资源: 将关键资源预先缓存到本地，用户下次访问时可以直接从缓存中读取。
资源版本控制: 在部署时给资源添加版本号或哈希值，确保浏览器能够正确识别并更新缓存。
4.图片优化：
使用响应式图片和适当的图片格式（如 WebP），并对图片进行压缩，减少加载时间。
使用延迟加载技术，使图片在用户滚动到相应位置时才加载。->
使用浏览器添加loading属性，loading="lazy"，又兼容性问题
使用IntersectionObserver API监听元素是否进入窗口加载触发图片



### 如何防止多次重复请求方案

#### UI按钮组件二次封装

#### Axios 请求拦截

### 如何确保 git 分支的维护

## 浏览器渲染原理

```tex
===渲染主线程===
HTML 解析（DOM 树构建）
CSS 解析（CSSOM 树构建）
合并 DOM + CSSOM → Render Tree
布局（Layout）
分层（Layer）
绘制（Paint）
===合成线程===
分块（Tiles)-合成线程多线程进行
光栅化（Raster)-GPU加速
画（Draw)-由GPT呈现
``` -->
