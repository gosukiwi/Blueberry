/*
 * A while statement
 * Node Format: { type: 'WHILE', condition: [expression], body: [statement]* }
 */

var expressionParser = require('./expression.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

module.exports = function(obj) {
    if(obj.type !== 'WHILE') {
        throw "This is not a while!";
    }

    var output = 'while (' + expressionParser(obj.condition) + ') {\n';

    scope.indent();

    for(var i = 0; i < obj.body.length; i += 1) {
        output += statementParser(obj.body[i]);
    }

    scope.dedent();
    output += scope.indentate() + '}';

    return output;
};
