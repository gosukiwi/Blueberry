/*
 * An identifier
 *  In IcedTea
 *      (identifier1, identifier 2, ... , identifier n)
 *      ()
 */
module.exports = function(obj) {
    // Arguments can be empty
    if(!obj) {
        return '';
    }

    if(obj.type !== 'ARGUMENTS') {
        throw "This is not an identifier!";
    }

    // The argument list is a list of identifiers only
    var parser = require('./identifier.js'),
        i,
        vals = [];

    for(i = 0; i < obj.values.length; i += 1) {
        vals.push('$' + parser(obj.values[i]));
    }

    return vals.join(', ');
};
