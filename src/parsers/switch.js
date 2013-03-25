/*
 *  A switch statement
 */
module.exports = function(obj) {
    if(obj.type !== 'SWITCH') {
        throw "This is not a switch!";
    }

    var expressionParser = require('./expression.js'),
        statementParser = require('./statement.js'),
        output,
        i,
        j;

    output = "switch (" + expressionParser(obj.condition) + ") {\n";

    for(i = 0; i < obj.cases.length; i += 1) {
        if(Array.isArray(obj.cases[i].condition)) {
            for(j = 0; j < obj.cases[i].condition.length; j += 1) {
                output += 'case ' + expressionParser(obj.cases[i].condition[j]) + ':\n';
            }
        } else if(obj.cases[i].condition === null) {
            output += 'default:\n';
        } else {
            output += 'case ' + expressionParser(obj.cases[i].condition) + ':\n';
        }

        for(j = 0; j < obj.cases[i].body.length; j += 1) {
            output += statementParser(obj.cases[i].body[j]);
        }

        output += 'break;\n';
    }

    output += '}';

    return output;
};
