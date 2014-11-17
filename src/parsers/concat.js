/*
 * Concatenation operator
 */
module.exports = function(obj) {
    if(obj.type !== 'CONCATENATION') {
        throw "This is not a concatenation!";
    }

    var parser = require('./expression.js');
    return parser(obj.left) + ' . ' + parser(obj.right);
};
