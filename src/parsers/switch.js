/*
 *  A switch statement
 */

var expressionParser = require('./expression.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

module.exports = function(obj) {
  if(obj.type !== 'SWITCH') {
    throw "This is not a switch!";
  }

  var output;
  var i, j;

  output = "switch (" + expressionParser(obj.condition) + ") {\n";

  scope.indent();

  for(i = 0; i < obj.cases.length; i += 1) {
    if(Array.isArray(obj.cases[i].condition)) {
      for(j = 0; j < obj.cases[i].condition.length; j += 1) {
        output += scope.indentate() + 'case ' + expressionParser(obj.cases[i].condition[j]) + ':\n';
      }
    } else if(obj.cases[i].condition === null) {
      output += scope.indentate() + 'default:\n';
    } else {
      output += scope.indentate() + 'case ' + expressionParser(obj.cases[i].condition) + ':\n';
    }

    scope.indent();

    for(j = 0; j < obj.cases[i].body.length; j += 1) {
      output += statementParser(obj.cases[i].body[j]);
    }

    output += "\n" + scope.indentate() + "break;\n";
    scope.dedent();
  }

  scope.dedent();

  output += '}';

  return output;
};
