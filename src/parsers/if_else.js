/*
 * An if - else statement
 */
outter_parser = function(obj) {
    if(obj.type !== 'IF_ELSE' && obj.type !== 'IF') {
        throw "This is not an if-else!";
    }

    var expressionParser = require('./expression.js'),
        statementParser = require('./statement.js'),
        output,
        i;

    output = 'if (' + expressionParser(obj.condition) + ') {\n';

    for(i = 0; i < obj.if_true.length; i += 1) {
        output += statementParser(obj.if_true[i]);
    }

    output += '} else ';

    // Now we have to see, if we just end here or we have an elseif

    if(obj.else.type === 'ELSE') {
        output += '{\n';

        for(i = 0; i < obj.else.statements.length; i += 1) {
            output += statementParser(obj.else.statements[i]);
        }

        output += "}\n";
    } else {
        output += outter_parser(obj.else);
    }

    return output;
};

module.exports = outter_parser;
