
# deep-emit

emit events to every listener in object tree

## Install

```sh
$ component install stagas/deep-emit
```

## Usage

```js
var emit = require('deep-emit');

function print(s) {
  document.write(s);
}

var obj = {
  onfoo: print,
  some: {
    notonfoo: print,
    level: {
      other: 'ignored',
      deep: {
        onfoo: print
      }
    }
  }
};

emit(obj, 'foo', 'bar'); // => barbar
```

## API

### emit(target, name, [...])

Emit `name` event to `target`
passing following parameters.

### emit.depth(target, name, [...])

Emit depth-first as method.

### emit.breadth(target, name, [...])

Emit breadth-first.

### emit.filter(fn)

Filter traversal using `fn`.

The passed function is invoked with
`(key, property)` and must return
`true` or `false` depending on whether
to traverse down that property.

## See also

[stagas/traverse-object](https://github.com/stagas/traverse-object)

## License

MIT
