var defaults = require('defaults-deep');
var rocambole = require('rocambole');
var _tk = require('rocambole-token');

var options;
var defaultOptions = {
  maxLineLength: 80,
  maxKeys: 3,
  forbidden: [
    'FunctionExpression'
  ]
};

module.exports = {
  setOptions: function(opts) {
    options = defaults(opts.collapseObjects || {}, {
      ObjectExpression: defaultOptions,
      ArrayExpression: defaultOptions
    });
  },

  transformAfter: function(ast) {
    rocambole.recursive(ast, transform);
  }
};

function transform(node) {
  // Don't try to collapse non-objects or non-arrays
  if (!~Object.keys(options).indexOf(node.type)) return;

  var nodeOptions = options[node.type];

  var parentType = node.parent.type;
  //if (parentType === 'Property' || parentType === 'ArrayExpression') {
  //  return;
  //}

  // It collapses objects that are short enough
  // 0 indicates measurement failed, ignore
  if ('maxLineLength' in nodeOptions) {
    var length = expectedLength(node);
    if (length === 0 || length > nodeOptions.maxLineLength) {
      return;
    }
  }

  if ('maxKeys' in nodeOptions) {
    if (getProperties(node).length > nodeOptions.maxKeys) {
      return;
    }
  }

  if ('forbidden' in nodeOptions) {
    for (var i = 0; i < getProperties(node).length; i++) {
      if (~nodeOptions.forbidden.indexOf(getValueAt(node, i).type)) {
        return;
      }
    }
  }

  // if none of the above returns, collapse the whitespace.
  collapse(node);
}

function isComposite(node) {
  return (node.type === 'ObjectExpression' || node.type === 'ArrayExpression');
}

function getProperties(node) {
  return node.properties || node.elements;
}

function getValueAt(node, key) {
  if (node.properties) {
    return node.properties[key].value;
  } else if (node.elements) {
    return node.elements[key];
  }
}

// Below from https://gist.github.com/jzaefferer/23bef744ffea751b2668
// Copyright Jörn Zaefferer; licensed MIT
function collapse(node) {
  // This one seems short
  _tk.eachInBetween(node.startToken, node.endToken, function(token) {
    if (_tk.isBr(token)) {

      // Insert one blank to replace the line break
      _tk.before(token, {
        type: 'WhiteSpace',
        value: ' '
      });

      // Remove all whitespace/indent after the line break
      var next = token.next;
      while (_tk.isEmpty(next)) {
        _tk.remove(next);
        next = next.next;
      }

      // Remove the line break itself
      _tk.remove(token);
    }
  });
}

function expectedLength(node) {
  var length = 0;

  var startOfTheLine = _tk.findPrev(node.startToken, 'LineBreak');

  // No linebreak indicates first line of the file, find first token instead
  if (!startOfTheLine) {
    startOfTheLine = _tk.findPrev(node.startToken, function(token) {
      return !token.prev;
    });
  }
  var firstChar = _tk.findNextNonEmpty(startOfTheLine);

  // Need to take into consideration the indent
  _tk.eachInBetween(startOfTheLine, firstChar, function(token) {
    length += String(token.raw || token.value).length;
  });

  var prev;
  _tk.eachInBetween(firstChar, node.endToken, function(token) {
    if (_tk.isEmpty(token)) {

      // Empty tokens are "collapsed" (multiple linebreaks/whitespace becomes
      // a single whitespace)
      length += _tk.isEmpty(prev) ? 0 : 1;
      prev = token;
      return;
    }

    // Don't collapse objects with line comments; block comments should be okay
    if (token.type === 'LineComment') {
      length += 1000;
    }
    length += String(token.raw || token.value).length;
    prev = token;
  });

  if (length === 0) {
    throw new Error('Failed to measure length of object expression: ' + node.toString());
  }

  return length;
}
