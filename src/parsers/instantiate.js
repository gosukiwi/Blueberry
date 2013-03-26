/*
 * Instantiation
 */
module.exports = function(obj) {
    if(obj.type !== 'INSTANTIATE') {
        throw "This is not an instantiation!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js');

    return '$' + identifierParser(obj.identifier) + ' = new ' + expressionParser(obj.expression) + ';';
};

