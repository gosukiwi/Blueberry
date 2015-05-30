/*
 * A class attribute
 */

var identifierParser = require('./identifier.js');
var constantParser   = require('./constant.js');
var expressionParser = require('./expression.js');
var state            = require('../state.js');

module.exports = function(obj, access) {
  var output;

  switch(obj.type) {
    case 'CLASS_CONSTANT_ATTRIBUTE':
      output = 'const ' + constantParser(obj.name) + " = " + expressionParser(obj.value) + ';';
      break;
    case 'CLASS_ATTRIBUTE':
      if(obj.value !== null) {
        output = access + ' $' + identifierParser(obj.name) + ' = ' + expressionParser(obj.value) + ';';
      } else {
        output = access + ' $' + identifierParser(obj.name) + ';';
      }
      break;
    case 'CLASS_STATIC_ATTRIBUTE':
      output = 'public static $' + identifierParser(obj.name) + ' = ' + expressionParser(obj.value) + ';';
      break;
    case 'COMMENT':
      return '';
      break;
    default:
      throw "Invalid type: " + obj.type;
      break;
  }

  return state.indentate() + output;
};
