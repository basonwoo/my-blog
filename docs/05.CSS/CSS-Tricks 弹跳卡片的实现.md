---
title: CSS-Tricks 弹跳卡片的实现
date: 2021-05-27 16:43:07
permalink: /pages/6c307b/
categories:
  - CSS
tags:
  - CSS
---

下午在逛 [CSS-Tricks](https://css-tricks.com/) 官网的时候看见这种滑动效果，模仿练习一下。

![](http://120.48.17.92:5120/uploads/big/a0003d7f71fb83c5a4019aa3472f238b.gif)

### 基础部分

打开 CodePen 编辑器，完成基础布局

![](http://120.48.17.92:5120/uploads/big/0ea75c882fc7a439e86d02b341d8aeb0.jpg)

### 动画原理

仔细观察原动画效果，当我们把鼠标移上去的时候，卡片本身会产生向左上角的位移（第一个卡片还会有旋转），同时它右边的所有卡片产生向右的位移

可以使用 `:hover` 以及 `~` 选择器实现

> ~：通用兄弟选择器，位置无须紧邻，只须同层级，A ~ B 选择 A 元素之后所有同层级 B 元素。

### 动画效果实现

![](http://120.48.17.92:5120/uploads/big/7f0d0457cda10eae89192d289dadfe18.jpg)

![](http://120.48.17.92:5120/uploads/big/498912df973eadc43705cdd5f223e0e1.gif)

### 优化

可以看到动画是有些僵硬的，加上缓动属性 `transition`

![](http://120.48.17.92:5120/uploads/big/a09069f20b90b7aedb2a7324800bd922.gif)

### DONE!

---

这个案例的代码在 [CodePen](https://codepen.io/basonwoo/pen/vYxJdLK)