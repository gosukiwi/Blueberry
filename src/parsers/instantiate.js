/*
 * Instantiation
 */

var identifierParser = require('./identifier.js');
var expressionListParser = require('./expressionList.js');

module.exports = function(obj) {
  if(obj.type !== 'INSTANTIATE') {
    throw "This is not an instantiation!";
  }

  return 'new ' + identifierParser(obj.expression) + '(' + expressionListParser(obj.arguments) + ')';
};
