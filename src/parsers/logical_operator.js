/*
 * Logical Operator
 */
module.exports = function(obj) {
    if(obj.type !== 'AND' && obj.type !== 'OR') {
        throw "This is not a logical operation! It can only be AND and OR!";
    }

    var operator = obj.type == 'AND' ? '&&' : '||',
        parser = require('./expression.js');

    return '(' + parser(obj.left) + ' ' + operator + ' ' + parser(obj.right) + ')';
};
