/*
 * Assignment
 *  In IcedTea:
 *      a = 1
 *  In PHP:
 *      $a = 1;
 */
module.exports = function(obj) {
    if(obj.type !== 'ASSIGN' && obj.type !== 'ASSIGN_INSTANCE_VARIABLE') {
        throw "This is not an assignment!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js');

    if(obj.type === 'ASSIGN_INSTANCE_VARIABLE') {
        return '$this->' + identifierParser(obj.identifier) + ' = ' + expressionParser(obj.expression) + ';';
    }

    return '$' + identifierParser(obj.identifier) + ' = ' + expressionParser(obj.expression) + ';';
};

