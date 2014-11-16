/*
 * A for
 */
module.exports = function(obj) {
    if(obj.type !== 'FOR' && obj.type !== 'COMPOSITE_FOR') {
        throw "This is not a for!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js'),
        statementParser = require('./statement.js'),
        output,
        i;

    if(obj.type === 'COMPOSITE_FOR') {
        output = 'foreach (' + expressionParser(obj.collection) + ' as $' + identifierParser(obj.key) + ' => $' + identifierParser(obj.value) + ') {\n';
    } else {
        // foreach over range() is inefficient - where possible, we can optimise it to a plain for loop
        if (obj.collection.type == 'RANGE') {
            output = 'for ($' + identifierParser(obj.name) + ' = ' + expressionParser(obj.collection.from) + '; $' + identifierParser(obj.name) + ' <= ' + expressionParser(obj.collection.to) + '; $' + identifierParser(obj.name) + '++) {\n'; 
        } else {
            output = 'foreach (' + expressionParser(obj.collection) + ' as $' + identifierParser(obj.name) + ') {\n';
        }
    }

    for(i = 0; i < obj.body.length; i += 1) {
        output += statementParser(obj.body[i]);
    }

    output += '}';

    return output;
};
