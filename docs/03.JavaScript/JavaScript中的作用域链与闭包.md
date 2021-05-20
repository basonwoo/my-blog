---
title: JavaScript 中的作用域链与闭包
date: 2021-05-05 16:30:00
permalink: /pages/js-closure
categories:
  - JavaScript
tags:
  - 闭包
author:
  name: basonwoo
---

我们都知道，在 JavaScript 中，函数、模块都可以形成作用域（一个存放变量的独立空间），它们之间可以相互嵌套，作用域之间会形成引用关系，这条链叫做作用域链。

### 静态作用域链

```javascript
function foo() {
  const _foo = "foo";

  function bar() {
    const _bar = "bar";

    {
      function baz() {
        const _baz = "baz";
      }
    }
  }
}
```

其中，存在 \_foo、\_bar、\_baz 三个变量，有 foo、bar、baz 三个函数，还有一个块，它们之间的作用域链可以用 babel 看一下。

```javascript
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const code = `
  function foo() {
    const _foo = "foo";

    function bar() {
      const _bar = "bar";

      {
        function baz() {
          const _baz = "baz";
        }
      }
    }
}
`;

const ast = parser.parse(code);

traverse(ast, {
  FunctionDeclaration(path) {
    if (path.get("id.name").node === "baz") {
      console.log(path.scope.dump());
    }
  },
});
```

结果是

![ast结果](/img/ast_res.png)

可视化一下就是这样

函数作用域和块作用域内的变量声明会在作用域（scoped）内创建一个绑定（binding，变量名绑定到具体的值），然后其余地方可以引用（refer）这个 binding，这样就是静态作用域的变量访问顺序。

### 为什么叫“静态”呢

因为这样的嵌套关系是通过分析代码就可以得出来的，不需要运行代码，按照这种顺序访问变量的链就是静态作用域链，这样的好处是可以直观地知道变量之间的引用关系。

相对地就存在动态作用域链，即作用域的引用关系与嵌套关系无关，而与执行顺序有关，会在执行的时候动态创建不同函数、不同块的作用域的引用关系。

静态作用域链是可以做静态分析的，比如刚刚使用 Babel 分析的 scope 链就是，所以绝大多数编程语言的作用域链设计都是选择静态的顺序。

但是，JavaScript 除了静态作用域链之外，还有一个特点就是函数可以作为返回值。比如：

```javascript
function foo() {
  const _foo = 1;
  return function() {
    console.log(_foo);
  };
}

const bar = foo();
```

这样就导致了一个问题，本来按照创建顺序调用一层层函数，按顺序创建和销毁作用域挺好的，但是如果内层函数返回或者通过别的方法暴露出去了，那么外层函数销毁，内层函数却没有销毁，这时该怎么处理作用域，父作用域是否需要销毁？

### 不按顺序的函数调用与闭包

比如将上面代码稍作改造，返回内部函数，然后在外部进行调用：

```javascript
function foo() {
  const _foo = "foo";

  function bar() {
    const _bar = "bar";

    function baz() {
      const _baz = "baz";
    }

    return baz
  }

  return bar
}

const bar = foo()
```

当调用 bar 的时候 foo 已经执行完了，这时候销不销毁？于是 JavaScript 就设计了闭包的机制。

### 闭包如何设计

先考虑一下我们如何解决这个静态作用域链中父作用域先于子作用域销毁的问题。

**首先，父作用域要不要销毁？是不是父作用域不销毁就行了？**

答案显然是不行的，父作用域中有很多东西与子函数无关，如果子函数没执行结束就让父函数一直常驻内存。这样肯定存在性能问题，所以还是需要进行销毁。但是销毁了父作用域不能影响子函数，所以要再创建个对象，要将子函数内引用（refer）的父作用域的变量打包进来，给子函数打包带走。

**怎么让子函数打包带走**

设计个独特的属性，比如 [[Scopes]]，用这个来存放函数用到的环境，并且这个属性需要是一个栈。因为函数有子函数，子函数可能还有子函数，每次打包都要放在这里一个包，所以需要设计成栈结构。

我们所考虑的这个解决方案：销毁父作用域后，将子函数用到的变量包起来，放到一个属性上。这就是闭包的机制。

我们来试验一下闭包的特性：
```javascript
function foo() {
  const _foo = "foo";

  function bar() {
    const _bar = "bar";

    function baz() {
      const _baz = "baz";
    }

    return baz
  }

  return bar
}

const bar = foo()
const baz = bar()
baz()
```

这个 baz 需不需要打包一些东西？会不会产生闭包？

