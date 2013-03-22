/*
 * Assignment
 *  In IcedTea:
 *      a = 1
 *  In PHP:
 *      $a = 1;
 */
module.exports = function(obj) {
    if(obj.type !== 'ASSIGN') {
        throw "This is not an assignment!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js');

    return '$' + identifierParser(obj.identifier) + ' = ' + expressionParser(obj.expression) + ';';
};

