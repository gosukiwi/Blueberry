/*
 * An arithmetic expression
 */
module.exports = function(obj) {
    if(obj.type !== 'ARITHMETIC') {
        throw "This is not an arithmetic expression!";
    }

    var parser = require('./expression.js');

    return '(' + parser(obj.left) + ' ' + obj.operation + ' ' + parser(obj.right) + ')';
};
