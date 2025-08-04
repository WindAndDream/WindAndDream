---
title: "CSS像素（px）与物理像素的关系"
meta_title: ""
description: "CSS像素（px）与物理像素的关系 CSS 前端"
date: 2025-07-31T21:13:00+08:00
image: "/images/blog/2025/7/css-px-to-physical-px/cover.jpg"
categories: ["CSS", "前端"]
author: "清风为梦"
tags: ["前端", "CSS"]
math: true
draft: false
---

## 章节介绍

当你从事网页开发时，必然会接触到 **CSS**，即 **层叠样式表（Cascading Style Sheets）**。

其中，你会接触到px，它作为一个常见的逻辑单位（不是实际的物理像素），难道你就不好奇 **px** 对比 **设备的物理像素** 之间的转换关系吗？

简单来说，如果我们有一个 **100px** 长的盒子，那么它对应的物理像素是多少呢？是根据什么决定的呢？

于是，在本章中，我将解释其中 **px（逻辑单位）** 和 **物理像素** 之间的计算方式，带着你一步一步推开px的神秘大门。

<hr/>

## 常用场景

我们先展示一些 **px属性值** 的常用场景：

### 尺寸相关

表示**宽度**为200px，**高度**为300px。

```css
{
  width: 200px; /** 宽度 */
  height: 300px; /** 高度 */
}
```

### 边距与内边距（外间距 & 内填充）

表示**外边距**15px，**内边距**为20px。

```css
{
  margin: 15px; /** 外边距 */
  padding: 20px; /** 内边距 */
}
```

### 定位与偏移

表示**顶部偏移**50px，**左侧偏移**50px，**右侧偏移**50px，**底部偏移**50px。

```css
{
  top: 50px; /** 顶部偏移 */
  left: 100px; /** 左侧偏移 */
  right: 30px; /** 右侧偏移 */
  bottom: 20px; /** 底部偏移 */
}
```

### 字体与文字

表示**字体大小**16px，**字符间距**1px，**行高**24px，**首行缩进**2px。

```css
{
  font-size: 16px; /** 字体大小 */
  letter-spacing: 1px; /** 字符间距 */
  line-height: 24px; /** 行高 */
  text-indent: 2px; /** 首行缩进 */
}
```

### 边框与阴影

表示**边框粗细**16px，**圆角大小**1px，**阴影示例**：**水平偏移**2px | **垂直偏移**2px | **模糊半径**2px | **颜色**2px。

```css
{
  border-width: 2px; /** 边框粗细 */
  border-radius: 8px; /** 圆角大小 */
  box-shadow: 2px 2px 5px gray; /** 阴影示例 */
}
```

<hr/>

## 物理像素与px的转换关系

我们需要先了解一个计算公式：$PhysicalPixel = px \cdot DPR$，这里的 **PhysicalPixel** 为物理像素。

**px的值** 是由开发者设置的，因此我们需要了解 **DPR** 是什么？如何计算得来？

在这里，所有的示例将以 **Windows10操作系统** 进行操作，如与其他不同版本及不同的操作系统有差异，可通过 **网络搜索** 或 **ai** 查询。

### 什么是DPR？

**DPR**，即 **Device Pixel Ratio（设备像素比）** 的缩写，是用来控制物理像素和px关系的重要因素。

### 如何查看DPR？

我们可以通过浏览器的 **开发者工具** 来查看，示例将展示 **Google浏览器** 的查看方式，其他浏览器也是大同小异。

以下将展示 **Google浏览器** 的查看方式。

#### 打开开发者工具

我们打开谷歌浏览器，按下键盘上的 **F12**，就会打开开发者工具。

如果你的设备为 **笔记本**，按了 **F12** 之后没有反应，则需要通过 **Fn + F12** 同时按。

这里不再赘述，如有疑惑可通过 **网络搜索** 或者 **ai**。

{{< image src="images/blog/2025/7/css-px-to-physical-px/browser-DPR/google/page-dev-tools.png" caption="" alt="alter-text" position="center" command="Fit" option="q100" class="img-fluid" title="Google浏览器开发者工具" webp="true" zoomable="true" >}}

#### 进入控制台

点击图中的 **console**，进入控制台。

{{< image src="images/blog/2025/7/css-px-to-physical-px/browser-DPR/google/page-console.png" alt="alter-text" position="center" command="Fit" option="q100" class="img-fluid" title="Google浏览器控制台" webp="true" zoomable="true" >}}

#### 控制台查询

我们在控制台中输入 **window.devicePixelRatio**，然后按下回车。

如图中所示，打印得出的 **1.25** 则是设备的 **DPR** 值。

{{< image src="images/blog/2025/7/css-px-to-physical-px/browser-DPR/google/page-console-DPR.png" alt="alter-text" position="center" command="Fit" option="q100" class="img-fluid" title="Google浏览器控制台DPR查询" webp="true" zoomable="true" >}}

### DPR的计算方式

当我们在浏览器的开发者工具查看 DPR 的值时，可能是 1.0、1.25、1.5，甚至更高或更低。

但想必心中可能会好奇，DPR 是如何计算出来的？

简单来说，DPR 的值就是由 **系统缩放比** 和 **浏览器缩放比** 相乘得出。

公式为：$DPR = SystemZoomRadio \cdot BrowserZoomRadio$，即 **系统缩放比（SystemZoomRadio）** 乘 **浏览器缩放比（BrowserZoomRadio）** 。

#### 系统缩放比

在图中，我们可以看见 **“更改文本、应用等项目的大小”** 的设置是一个百分比，这里的百分比则是 **系统缩放比**。

{{< gallery dir="images/blog/2025/7/css-px-to-physical-px/desktop-DPR" webp="true" command="Fit" zoomable="true" >}}

#### 浏览器缩放比

在浏览器的缩放比中，我将以 **Google浏览器** 作为例子，其他浏览器也大同小异，这里就不一一展示。

我们可以通过按住键盘上的 **ctrl**，同时按键盘上的 **-** / **+** 号，或者通过 **鼠标滚轮**，就能缩放浏览器。

{{< image src="images/blog/2025/7/css-px-to-physical-px/browser-DPR/google/zoom.png" alt="alter-text" position="center" command="Fit" option="q100" class="img-fluid" title="Google浏览器缩放比" webp="true" zoomable="true" >}}

<hr/>

## 总结

从上面的示例中，我们可以查看自己设备的 **系统缩放比** 和 **浏览器缩放比**。

就以上图为例，我们结合公式得出：$1.375 = 1.25 \cdot 1.1$，及DPR的值为 **1.375**。

当我们得出DPR的值时，我们就可以计算物理像素和px之间的转换关系了。

假设 **DPR** 为 **1.375**、**px** 为 **10px**，则对应的物理像素为 $13.75 = 1.375 \cdot 10$，物理像素为 **13.75**。
