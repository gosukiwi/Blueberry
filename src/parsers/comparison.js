/*
 * A comparison operator, greater than, smaller than, etc.
 */

// A map of Blueberry operators to JS operators
var operatorMap = {
    '==': '===',
    '!=': '!==',
    '>' : '>',
    '<' : '<',
    '>=': '>=',
    '<=': '<='
};

module.exports = function(obj) {
    if(obj.type !== 'COMPARISON') {
        throw "This is not a comparison!";
    }

    var parser = require('./expression.js');

    return parser(obj.left) + ' ' + operatorMap[obj.operator] + ' ' + parser(obj.right);
};
