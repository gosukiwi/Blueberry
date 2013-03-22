/*
 * A while
 */
module.exports = function(obj) {
    if(obj.type !== 'WHILE') {
        throw "This is not a while!";
    }

    var expressionParser = require('./expression.js'),
        statementParser = require('./statement.js'),
        output,
        i;

    output = 'while (' + expressionParser(obj.condition) + ') {\n';

    for(i = 0; i < obj.body.length; i += 1) {
        output += statementParser(obj.body[i]);
    }

    output += '}';

    return output;
};
