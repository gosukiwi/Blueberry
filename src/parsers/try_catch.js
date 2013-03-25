/*
 * A try-catch block
 */
module.exports = function(obj) {
    if(obj.type !== 'TRY_CATCH') {
        throw "This is not a try-catch!";
    }

    var expressionParser = require('./expression.js'),
        statementParser = require('./statement.js'),
        output,
        i;

    output = 'try {\n';
    for(i = 0; i < obj.try.length; i += 1) {
        output += statementParser(obj.try[i]);
    }

    if(obj.catch_argument === null) {
        output += '} catch (Exception $ex) {\n';
    } else {
        output += '} catch (Exception ' + expressionParser(obj.catch_argument) + ') {\n';
    }

    for(i = 0; i < obj.catch.length; i += 1) {
        output += statementParser(obj.catch[i]);
    }

    if(obj.finally !== null) {
        output += '} finally {\n';
        for(i = 0; i < obj.finally.length; i += 1) {
            output += statementParser(obj.finally[i]);
        }
    }

    output += '}';

    return output;
};
