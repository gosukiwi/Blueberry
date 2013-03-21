/*
 * An expression list, used for calling functions
 */
module.exports = function(obj) {
    if(!obj) {
        return '';
    }

    var i,
        parser = require('./expression.js'),
        vals = [];

    for(i = 0; i < obj.values.length; i += 1) {
        vals.push(parser(obj.values[i]));
    }

    return vals.join(', ');
};
