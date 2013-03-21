/*
 * An if
 */
module.exports = function(obj) {
    if(obj.type !== 'IF') {
        throw "This is not an if!";
    }

    var expressionParser = require('./expression.js'),
        statementParser = require('./statement.js'),
        output,
        i;

    output = 'if (' + expressionParser(obj.condition) + ') {\n';

    for(i = 0; i < obj.statements.length; i += 1) {
        output += statementParser(obj.statements[i]);
    }

    output += '}\n';

    return output;
};
