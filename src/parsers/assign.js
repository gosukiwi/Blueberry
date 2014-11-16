/*
 * Assignment
 *  In Blueberry:
 *      a = 1
 *  In PHP:
 *      $a = 1;
 */
var outter_parser = function(obj) {
    if(obj.type !== 'ASSIGN' && obj.type !== 'ASSIGN_INSTANCE_VARIABLE'
        && obj.type !== 'ASSIGN_TERNARY_OPERATOR' && obj.type !== 'ASSIGN_DEFAULT_VALUE') {
        throw "This is not an assignment!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js');

    if(obj.type === 'ASSIGN_INSTANCE_VARIABLE') {
        return '$this->' + outter_parser(obj.assignment).substring(1);
    } else if(obj.type === 'ASSIGN_TERNARY_OPERATOR') {
        return '$' + identifierParser(obj.identifier) + ' = ' + 
            expressionParser(obj.condition) + ' ? ' + expressionParser(obj.left) + ' : ' + expressionParser(obj.right) + ';';
    } else if(obj.type === 'ASSIGN_DEFAULT_VALUE') {
        return '$' + identifierParser(obj.identifier) + ' = ' + 
            expressionParser(obj.left) + ' ? ' + expressionParser(obj.left) + ' : ' + expressionParser(obj.right) + ';';
    }

    var mode = obj.mode === 'BY_REFERENCE' ? '&=' : '=';

    return '$' + identifierParser(obj.identifier) + ' ' + mode + ' ' + expressionParser(obj.expression) + ';';
};

module.exports = outter_parser;
