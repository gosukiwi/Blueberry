/*
 * Boolean NOT
 */
module.exports = function(obj) {
    if(obj.type !== 'BOOL_NOT') {
        throw "This is not a boolean NOT!";
    }

    var parser = require('./expression.js');

    return '!' + parser(obj.value);
};
