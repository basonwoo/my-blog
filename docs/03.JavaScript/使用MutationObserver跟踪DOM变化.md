---
title: 使用 MutationObserver 跟踪DOM变化
date: 2022-03-16 11:01:47
permalink: /pages/404938/
categories:
  - JavaScript
tags:
  - 
---

### MutationObserver 概述


[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)中对于`MutationObserver`的描述是这样的

> MutationObserver接口提供了监视对DOM树所做更改的能力

概念上，它很接近事件，可以理解为 DOM 发生变动就会触发 MutationObserver 事件。但是，它与事件有一个本质不同：事件是同步触发，也就是说，DOM 的变动立刻会触发相应的事件；MutationObserver 则是异步触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。

举个例子，如果文档中连续插入1000个`<li>`标签，就会连续触发 1000 个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；而 MutationObserver 完全不同，只在 1000 个段落都插入结束后才会触发，而且只触发一次。

MutationObserver 有以下特点：

- 采用异步方式
- 把 DOM 变动记录封装成一个队列进行处理，而不是一条条地个别处理 DOM 变动
- 可以观察发生 DOM 节点发生的所有变动，也可以具体观察某一类变动

在很多情况下，MutationObserver API 都可以派上用场，例如:

- 希望让用户知晓他当前所在的页面发生了一些更改
- 需要根据 DOM 的变化动态加载 JavaScript 模块
- 开发编辑器时实现撤消/重做功能，通过利用 MutationObserver API，可以知道在任何给定的点上进行了哪些更改，因此可以轻松地撤消这些更改

### MutationObserver 用法

使用 MutationObserver 相当简单，只创建一个 MutationObserver 实例，每当有变化发生，这个函数将会被调用。函数的第一个参数是变动数组，每个变化都会提供它的类型和已经发生的变化的信息

```javascript
const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log(mutation);
  })
})
```

`observer`实例拥有三个方法：

- observe   — 启动监听
- disconnect — 用来停止观察
- takeRecords  — 清除所有待处理的变动，即不再处理未处理的变动

#### observer

根据配置，观察者会观察 DOM 树中的单个 Node，也可能会观察被指定节点的部分或者所有的子孙节点
```javascript
mutationObserver.observe(target[, options])
```

此方法接收两个参数
- target - 要观察的 DOM 节点
- options - 一个配置对象，指定要观察的特定变化

```javascript
mutationObserver.observe(document.documentElement, {
  attributes: true,           // 要监视的特定属性名称的数组。如果未包含此属性，则对所有属性的更改都会触发变动通知。无默认值。
  characterData: true,        // 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变化
  childList: true,            // 设为 true 以监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点
  subtree: true,              // 设为 true 以将监视范围扩展至目标节点整个节点树中的所有节点
  attributeOldValue: true,    // 当监视节点的属性改动时，将此属性设为 true 将记录任何有改动的属性的上一个值
  characterDataOldValue: true // 设为 true 以在文本在受监视节点上发生更改时记录节点文本的先前值
});
```

创建一个`div`，删除 class，在调用 observe 之后，在控制台就可以看到打印出的`MutationRecord`日志

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/Snipaste_2022-03-16_11-27-23-FTWQcy.png)

MutationRecord 对象包含了DOM的相关信息，有如下属性：

> type：观察的变动类型（attribute、characterData或者childList）
> 
> target：发生变动的 DOM 节点
> 
> addedNodes：新增的 DOM 节点
> 
> removedNodes：删除的 DOM 节点
> 
> previousSibling：前一个同级节点，如果没有则返回 null
> 
> nextSibling：下一个同级节点，如果没有则返回 null
> 
> attributeName：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
> 
> oldValue：变动前的值。这个属性只对 attribute 和 characterData 变动有效，如果发生 childList 变动，则返回 null

使用`mutationObserver.disconnect()`停止观察 DOM

### 浏览器兼容性

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/Snipaste_2022-03-16_11-33-37-pmVLGh.png)
