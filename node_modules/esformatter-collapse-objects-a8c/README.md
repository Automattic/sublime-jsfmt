# esformatter-collapse-objects

[esformatter](https://github.com/millermedeiros/esformatter) plugin for
conditionally collapsing object and array literals.

An Automattic fork of [wbinnssmith's original](https://github.com/wbinnssmith/esformatter-collapse-objects)


## Usage

install it:

```sh
npm install esformatter-collapse-objects-a8c
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
      "forbidden": [
        "FunctionExpression"
      ]
    },
    "ArrayExpression": {
      "maxLineLength": 80,
      "maxKeys": 5,
      "forbidden": [
        "FunctionExpression"
      ]
    }
  }
}
```

## Important

In order to collapse Array literals, you need to have esformatter expand them in
the first place. Add the following to your esformatter config when collapsing
Arrays:

```json
"lineBreak": {
  "before": {
    "ArrayExpressionClosing": 1
  },
  "after": {
    "ArrayExpressionOpening": 1,
    "ArrayExpressionComma": 1
  }
},
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

The following is the default configuration for the plugin:

```js

{
  ObjectExpression: {
    maxLineLength: 80,
    maxKeys: 3,
    forbidden: [
      'FunctionExpression'
    ]
  },
  ArrayExpression: {
    maxLineLength: 80,
    maxKeys: 3,
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
      forbidden: [
        'FunctionExpression'
      ]
    },
    "ArrayExpression": {
      maxLineLength: 80,
      maxKeys: 5,
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
