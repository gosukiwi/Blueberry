/*
 * Expression
 *  In Blueberry:
 *      And, Or
 *      >, <, >=, <=, ==, !=
 *      -, +, *, /
 *      Function Call
 *      String
 *      Number
 *      Identifier
 */
var outter_parser = function(obj) {
  'use strict';

  var output;
  var parser = {
    number: require('./number.js'),
    real_number: require('./real_number.js'),
    string: require('./string.js'),
    identifier: require('./identifier.js'),
    logical_operator: require('./logical_operator.js'),
    arithmetic: require('./arithmetic.js'),
    call: require('./call_expression.js'),
    comparison: require('./comparison.js'),
    concat: require('./concat.js'),
    bool: require('./bool.js'),
    nil: require('./nil.js'),
    range: require('./range.js'),
    array_identifier: require('./array_identifier.js'),
    array_create: require('./array_create.js'),
    json_array: require('./json_array.js'),
    bool_not: require('./bool_not.js'),
    symbol: require('./symbol.js'),
    list_comprehesion: require('./list_comprehension.js'),
    closure: require('./closure.js')
  };

  switch(obj.type) {
    case 'NIL':
      output = parser.nil(obj);
      break;
    case 'BOOL':
      output = parser.bool(obj);
      break;
    case 'NUMBER':
      output = parser.number(obj);
      break;
    case 'REAL_NUMBER':
      output = parser.real_number(obj);
      break;
    case 'SYMBOL':
      output = parser.symbol(obj);
      break;
    case 'STRING':
      output = parser.string(obj);
      break;
    case 'CONCATENATION':
      output = parser.concat(obj);
      break;
    case 'ARITHMETIC':
      output = parser.arithmetic(obj);
      break;
    case 'RANGE':
      output = parser.range(obj);
      break;
    case 'CALL':
    case 'CALL_METHOD':
    case 'CALL_PROPERTY':
    case 'CALL_CHAIN':
      output = parser.call(obj);
      break;
    case 'BOOL_NOT':
      output = parser.bool_not(obj);
      break;
    case 'AND':
    case 'OR':
      output = parser.logical_operator(obj);
      break;
    case 'COMPARISON':
      output = parser.comparison(obj);
      break;
    case 'PARENS_EXPRESSION':
      output = '(' + outter_parser(obj.expression) + ')';
      break;
    case 'INSTANCE_IDENTIFIER':
      // @myInstanceVariable
      output = '$this->' + parser.identifier(obj);
      break;
    case 'LIST_COMPREHENSION':
      // List comprehension can be either a statement or an expression.
      // By default it's treated a statement thus the compiler adds ';'.
      // Let's remove it because we want an expression now.
      output = parser.list_comprehesion(obj).slice(0, -1);
      break;
    case 'JSON_ARRAY':
      output = parser.json_array(obj);
      break;
    case 'ARRAY_CREATE':
      output = parser.array_create(obj);
      break;
    case 'ARRAY_IDENTIFIER':
      output = parser.array_identifier(obj);
      break;
    case 'IDENTIFIER':
      // When an expression is parsed, it checks for a function call
      // or an identifier, the identifier will always be a variable n_n
      output = '$' + parser.identifier(obj);
      break;
    case 'CLOSURE':
      output = parser.closure(obj);
      break;
    default:
      throw 'Invalid expression type: ' + obj.type;
  }

  return output;
};

module.exports = outter_parser;

