/*
 * A comparison operator, greater than, smallr than, etc.
 */
module.exports = function(obj) {
    if(obj.type !== 'COMPARISON') {
        throw "This is not a comparison!";
    }

    var parser = require('./expression.js');

    return parser(obj.left) + ' ' + obj.operator + ' ' + parser(obj.right);
};
