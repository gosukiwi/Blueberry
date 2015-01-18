/*
 * A try-catch block
 * Node Format: { type: 'TRY_CATCH', try: [statement]*, catch_argument: [identifier] | null, catch: [statement]*, finally: [statement]* | null }
 */

var expressionParser = require('./expression.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

module.exports = function(obj) {
    if(obj.type !== 'TRY_CATCH') {
        throw "This is not a try-catch!";
    }

    var output;
    var i;

    scope.indent();

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

    scope.dedent();
    return output;
};
