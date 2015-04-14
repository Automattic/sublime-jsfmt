# esformatter-collapse-objects

[esformatter](https://github.com/millermedeiros/esformatter) plugin for
conditionally collapsing object and array literals.


## Usage

install it:

```sh
npm install esformatter-collapse-objects
```

and something like this to your esformatter config file:

```json
{
  "plugins": [
    "esformatter-collapse-objects"
  ],
  "collapseObjects": {
    "ObjectExpression": {
      "maxLineLength": 80,
      "maxKeys": 3,
      "maxDepth": 1,
      "forbidden": [
        "FunctionExpression"
      ]
    },
    "ArrayExpression": {
      "maxLineLength": 80,
      "maxKeys": 5,
      "maxDepth": 2,
      "forbidden": [
        "FunctionExpression"
      ]
    }
  }
}
```


## Options

  Options map esprima AST Node types (in this case both ObjectExpression and
  ArrayExpression) to their respective options, just like indentation in
  esformatter.

  You can also avoid collapsing literals under certain conditions
  like a maximum number of keys, or when they contain other nodes like
  FunctionExpression.

  ```js
  [function foo() { return 'bar' }]
  ```

  for example, could never occur since FunctionExpression is forbidden when
  trying to collapse a literal if this is set.

  You can also limit the depth of nested literals. All literals begin at a depth
  of 1, and for performance reasons setting a maxDepth of greater than 3 is
  ignored. For example, `{foo: { bar: 'baz' }}` has a depth of two and would be
  collapsed if the maxDepth is 2 or greater.

  The following is the default configuration for the plugin:

  ```js

  {
    ObjectExpression: {
      maxLineLength: 80,
      maxKeys: 3,
      maxDepth: 2,
      forbidden: [
        'FunctionExpression'
      ]
    },
    ArrayExpression: {
      maxLineLength: 80,
      maxKeys: 3,
      maxDepth: 2,
      forbidden: [
        'FunctionExpression'
      ]
    }
  }
  ```

## JavaScript API

Register the plugin and call esformatter like so:

```js
// register plugin
esformatter.register(require('esformatter-collapse-objects'));
// pass options as second argument
var output = esformatter.format(str, {
  "collapseObjects": {
    "ObjectExpression": {
      maxLineLength: 80,
      maxKeys: 3,
      maxDepth: 1,
      forbidden: [
        'FunctionExpression'
      ]
    },
    "ArrayExpression": {
      maxLineLength: 80,
      maxKeys: 5,
      maxDepth: 2,
      forbidden: [
        'FunctionExpression'
      ]
    }
  }
});
```

## License

Released under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Huge thanks to Jörn Zaefferer, who published [an MIT-licensed gist](https://gist.github.com/jzaefferer/23bef744ffea751b2668)
which serves as the foundation for this module.
