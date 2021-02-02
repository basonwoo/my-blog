---
title: Vue中的DOM Diff算法
date: 2021-02-02 16:30:00
permalink: /pages/8309a5b876fc95e3
categories: 
  - Vue
tags: 
  - Diff算法
author: 
  name: basonwoo
---

### 引言

在现代前端框架中，Virtual DOM几乎成了标配，通过 VDOM 我们可以实现对真实 DOM 的最少操作，从而提升页面的性能。

![Virtual DOM](/img/diff_1.jpg)

### Vue
Vue 的 Diff 借鉴了 [snabbdom](https://github.com/snabbdom/snabbdom/blob/v0.7.3/src/snabbdom.ts#L179)

假设我们需要由【A、B、C、D、E、F、G】转换为【D、A、G、F、K、E】

设定4个指针 OS(OldStart)、OE(OldEnd)、NS(NewStart)、NE(NewEnd)，分别指向这两个序列的头尾。

```
A  B  C  D  E  F  G
?                 ?
OS                OE

D  A  G  F  K  E
?              ?
NS             NE
```
>如果OS或OE位置的节点与NS位置的节点相同，则将对应节点移动到NS位置，如果OS或OE位置的节点与NE位置的节点相同，则将对应节点移动到NE位置。

>如果都没有相同的，则在真实 DOM 中找到 NS 位置的节点，移动到 NS 位置。

第一轮比较：

可见，【A、G】与【D、E】之间没有相同的，那么就找到 D，移动到 NS 位置。这是第一次 DOM 操作，此时真实 DOM 为【D、A、B、C、E、F、G】，NS++ ，OS++，现在 4 个指针指向为：
```
D  A  B  C  E  F  G
   ?              ?
   OS             OE

D  A  G  F  K  E
   ?           ?
   NS          NE
```
第二轮比较：

OS 与 NS 位置的节点相同，不用执行任何操作，OS++，NS++，现在 4 个指针的指向为：
```
D  A  B  C  E  F  G
      ?           ?
      OS          OE

D  A  G  F  K  E
      ?        ?
      NS       NE
```
第三轮比较：

OE 和 NS 位置的节点相同，将 OE 位置节点移动到 NS 位置。这是第二次操作 DOM，此时真实 DOM 为【D、A、G、B、C、E、F】，OE-，NS++，现在 4 个指针指向为：
```
D  A  G  B  C  E  F
         ?        ?
         OS       OE

D  A  G  F  K  E
         ?     ?
         NS    NE
```
第四轮比较：

OE 与 NS 节点相同，将 OE 位置节点移动到 NS 位置。这是第三次操作 DOM，此时真实 DOM 为【D、A、G、F、B、C、E】，OE-，NS++，现在 4 个指针指向为：
```
D  A  G  F  B  C  E
            ?     ?
            OS    OE

D  A  G  F  K  E
            ?  ?
            NS NE
```
第五轮比较：

OE 与 NE 相同，不执行任何操作，OE-，NE-，现在 4 个指针的指向为：
```
D  A  G  F  B  C  E
            ?  ?
            OS OE

D  A  G  F  K  E
            ?
            NS=NE
```
第六轮比较：

NS(或 NE) 指向的节点在真实 DOM 中并不存在，因此创建节点 K，这是第四次操作 DOM，此时真实 DOM 为【D、A、G、F、K、B、C、E】，NS++，现在 4 个指针的指向为：
```
D  A  G  F  K  B  C  E
               ?  ?
               OS OE

D  A  G  F  K  E
            ?  ?
            NE NS
```
第七轮比较：

由于 NE < NS，意味着新序列中已经没有可遍历的元素，因此 OS 与 OE 闭区间内的节点都需要删除，这是第五、六次操作 DOM，此时真实 DOM 为【D、A、G、F、K、E】

总结一下 Vue 的 DOM Diff 算法的关键逻辑：

1. 建立新序列头尾、老序列头尾一共 4 个指针，然后将 NS/NE 与 OS/OE 比较；
2. 如果发现有 OS/OE 的节点与 NS/NE 相同，则将对应节点移动到 NS/NE 位置

简单来说， Vue 的 Diff 过程就是查找排序的过程，**遍历 VDOM 的节点，在真实 DOM 中找到对应节点，并移动到新的位置上。**不过由于使用了双向遍历的方式，加快了遍历的速度。

由以上我们可以推导出对该算法最不利的情况为**反转序列**，比如从【A、B、C、D】到【D、C、B、A】，算法将执行 N-1 次移动，所以在实际开发中应该注意避免反转序列的操作。

包括 Vue 在内的众多框架在同一层级节点中都希望业务指定一个 Key 来判断重渲染前后是否为同一个节点，如果 Key 值不同，那么 DOM 节点将不会被复用。

在很多文章中，都认为使用数组遍历的序号做 Key 值是不可取的，不过这也取决与具体场景，如果遍历的数据是静态不可变的，那么使用序号做 Key 不会有什么问题。

那么如果数组顺序变化，依然使用序号做 Key 会有什么问题呢？

首先，对于性能来说，渲染前后对于同一个序号的数据发生了变化，框架仍然可能会复用节点，但可能会导致后代节点的大量删除与生成；

其次，对于渲染结果正确性来说，一般不会有什么问题。但有一种场景，就是 DOM 中的数据并没有同步到框架中，那么重渲染之后未同步的数据很可能出现在错误的节点中。