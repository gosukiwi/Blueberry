/*
 * An arithmetic expression
 */

var parser = require('./expression.js');

module.exports = function(obj) {
    if(obj.type !== 'ARITHMETIC') {
        throw "This is not an arithmetic expression!";
    }

    return '(' + parser(obj.left) + ' ' + obj.operation + ' ' + parser(obj.right) + ')';
};
