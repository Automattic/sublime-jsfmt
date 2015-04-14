//jshint node:true, eqnull:true
/*global describe, it, beforeEach*/
'use strict';

var esformatter = require('esformatter');
var fs = require('fs');
var collapseObjects = require('../');
var expect = require('chai').expect;


describe('compare input/output', function() {
  beforeEach(function() {
    esformatter.register(collapseObjects);
    this.config = {
      preset: 'default',

      lineBreak: {
        before: {
          ArrayExpressionClosing: 1
        },
        after: {
          ArrayExpressionOpening: 1,
          ArrayExpressionComma: 1
        }
      },

      collapseObjects: {
        ObjectExpression: {},
        ArrayExpression: {}
      }
    };
  });

  ['objects', 'arrays'].forEach(function(type) {
    describe('deep ' + type, function() {
      it('deals with nested structures', function() {
        var input = getFile(type, 'input-depth.js');
        var output = esformatter.format(input, this.config);

        expect(output).to.be.eql(getFile(type, 'output-depth.js'));
      });
    });

    describe('line lengths', function() {
      it('doesnt collapse long lines', function() {
        var input = getFile(type, 'input-linelength.js');
        this.config.collapseObjects.ObjectExpression.maxLineLength = 30;
        this.config.collapseObjects.ArrayExpression.maxLineLength = 30;
        var output = esformatter.format(input, this.config);

        expect(output).to.be.eql(getFile(type, 'output-linelength.js'));
      });
    });

    describe('keycounts', function() {
      it('doesnt collapse beyond a key count', function() {
        var input = getFile(type, 'input-keycount.js');
        var output = esformatter.format(input, this.config);

        expect(output).to.be.eql(getFile(type, 'output-keycount.js'));
      });
    });
  });
});

function getFile(type, name) {
  return fs.readFileSync('test/compare/' + type + '/' + name).toString();
}
