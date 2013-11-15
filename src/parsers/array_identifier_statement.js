/*
 * An array identifier
 * Access an array index
 */
module.exports = function(obj) {
    if(obj.type !== 'ARRAY_IDENTIFIER') {
        throw "This is not an array identifier!";
    }

    var parser = require('./expression.js');

    return '$' + obj.name.value + "[" + parser(obj.index) + "];";
};
