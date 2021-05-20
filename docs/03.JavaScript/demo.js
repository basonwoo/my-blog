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
debugger
baz()