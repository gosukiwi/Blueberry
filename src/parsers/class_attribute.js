/*
 * A class attribute
 */
module.exports = function(obj, access) {
    var output,
        identifierParser = require('./identifier.js'),
        expressionParser = require('./expression.js'),
        commentParser = require('./comment.js');

    switch(obj.type) {
        case 'CLASS_ATTRIBUTE':
            if(obj.value !== null) {
                output = access + ' $' + identifierParser(obj.name) + ' = ' + expressionParser(obj.value) + ';';
            } else {
                output = access + ' $' + identifierParser(obj.name) + ';';
            }
            break;
        case 'CLASS_STATIC_ATTRIBUTE':
            output = 'public static $' + identifierParser(obj.name) + ' = ' + expressionParser(obj.value) + ';';
            break;
        //case 'EMPTY':
        //    output = emptyParser(obj);
        //    break;
        case 'COMMENT':
            output = commentParser(obj);
            break;
        default:
            throw "Invalid type: " + obj.type;
            break;
    }

    return output;
};
