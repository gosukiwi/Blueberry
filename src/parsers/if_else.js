/*
 * An if - else statement
 */

var expressionParser = require('./expression.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

var outter_parser = function(obj) {
  if(obj.type !== 'IF_ELSE' && obj.type !== 'IF') {
    throw "This is not an if-else!";
  }

  scope.indent();
  var output = 'if (' + expressionParser(obj.condition) + ') {\n';

  for(var i = 0; i < obj.if_true.length; i += 1) {
    output += statementParser(obj.if_true[i]);
  }

  scope.dedent();
  output += scope.indentate() + '} else ';

  // Now we have to see, if we just end here or we have an elseif
  if(obj.else.type === 'ELSE') {
    output += '{\n';
    scope.indent();

    for(i = 0; i < obj.else.statements.length; i += 1) {
      output += statementParser(obj.else.statements[i]);
    }

    scope.dedent();
    output += scope.indentate() + "}";
  } else {
    output += outter_parser(obj.else);
  }

  return output;
};

module.exports = outter_parser;
