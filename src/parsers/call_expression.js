/*
 * A function called as an expression
 */

var identifierParser = require('./identifier.js'),
    argumentsParser  = require('./expressionList.js'),
    expressionParser = require('./expression.js'),
    scope            = require('../state.js');

function outer_parser(obj) {
  'use strict';

  var output;

  switch(obj.type) {
    case 'CALL':
      var name = identifierParser(obj.identifier);
      // If the identifier name is on the current scope, it's a variable
      // function call. Normal function call otherwise.
      output = scope.contains(name) ? '$' : '';
      output += name + '(' + argumentsParser(obj.args) + ')';
      break;
    case 'CALL_CHAIN':
      output = expressionParser(obj.left) + '->' + outer_parser(obj.right);
      break;
    case 'CALL_METHOD':
      if( obj.object.type === 'IDENTIFIER' 
          && !scope.contains(identifierParser(obj.object))
      ) {
        output = identifierParser(obj.object) + '::' + outer_parser(obj.method);
      } else {
        output = expressionParser(obj.object) + '->' + outer_parser(obj.method);
      }
      break;
    case 'CALL_PROPERTY':
      // When calling a property, `self` has a special meaning. It's used to
      // reference static properties
      if(obj.object.type === 'IDENTIFIER' && obj.object.value === 'self') {
        output = 'self::' + expressionParser(obj.property).substring(1);
      } else {
        output = expressionParser(obj.object) + '->' + expressionParser(obj.property).substring(1);
      }
      break;
    case 'IDENTIFIER':
      return identifierParser(obj);
    default:
      throw 'Invalid type: ' + obj.type;
  }

  return output;
}

module.exports = outer_parser;
