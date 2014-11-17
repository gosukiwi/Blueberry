/*
 * A class method statement
 */
module.exports = function(obj) {
    if(obj.type !== 'CLASS_METHOD') {
        throw "This is not a class method!";
    }

    var parseIdentifier = require('./identifier.js'),
        parseArguments = require('./arguments.js'),
        parseStatement = require('./statement.js'),
        output,
        i;

    output = obj.access + ' function ' + parseIdentifier(obj.def.name) + ' (' + parseArguments(obj.def.args) + ') {\n';
    
    for(i = 0; i < obj.def.statements.length; i += 1) {
        output += parseStatement(obj.def.statements[i]);
    }

    output += "}";

    return output;
};
