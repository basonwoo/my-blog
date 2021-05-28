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

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62021-05-27-16.37.05.gif)

### 基础部分

打开 CodePen 编辑器，完成基础布局

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_17-51-37.jpg)

### 动画原理

仔细观察原动画效果，当我们把鼠标移上去的时候，卡片本身会产生向左上角的位移（第一个卡片还会有旋转），同时它右边的所有卡片产生向右的位移

可以使用 `:hover` 以及 `~` 选择器实现

> ~：通用兄弟选择器，位置无须紧邻，只须同层级，A ~ B 选择 A 元素之后所有同层级 B 元素。

### 动画效果实现

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_18-05-06.jpg)

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/2021-05-27-18.06.12.gif)

### 优化

可以看到动画是有些僵硬的，加上缓动属性 `transition`

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/2021-05-27-18.09.52.gif)

### DONE!

---

这个案例的代码在 [CodePen](https://codepen.io/basonwoo/pen/vYxJdLK)