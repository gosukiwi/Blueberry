/*
 * A class attribute
 */
module.exports = function(obj) {
    var output,
        identifierParser = require('./identifier.js'),
        expressionParser = require('./expression.js'),
        emptyParser = require('./empty.js'),
        commentParser = require('./comment.js');

    switch(obj.type) {
        case 'CLASS_ATTRIBUTE':
            if(obj.value !== null) {
                output = obj.access + ' $' + identifierParser(obj.name) + ' = ' + expressionParser(obj.value) + ';';
            } else {
                output = obj.access + ' $' + identifierParser(obj.name) + ';';
            }
            break;
        case 'EMPTY':
            output = emptyParser(obj);
            break;
        case 'COMMENT':
            output = commentParser(obj);
            break;
        default:
            throw "Invalid type: " + obj.type;
            break;
    }

    return output;
};
