/*
 * Instantiation
 */

var expressionParser = require('./expression.js');
var identifierParser = require('./identifier.js');
var scope            = require('../state.js');

module.exports = function(obj) {
  if(obj.type !== 'INSTANTIATE') {
    throw "This is not an instantiation!";
  }

  var output = '$' + identifierParser(obj.identifier) + ' = new ' + expressionParser(obj.expression) + ';';

  // Add variable name to scope
  scope.add(obj.identifier.value);

  return output;
};

