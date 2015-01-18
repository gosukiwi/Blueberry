/*
 * An if
 */

var expressionParser = require('./expression.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

module.exports = function(obj) {
  if(obj.type !== 'IF') {
      throw "This is not an if!";
  }

  var output = 'if (' + expressionParser(obj.condition) + ') {\n';
  scope.indent();

  for(var i = 0; i < obj.statements.length; i += 1) {
      output += statementParser(obj.statements[i]);
  }

  scope.dedent();
  output += scope.indentate() + '}';

  return output;
};
