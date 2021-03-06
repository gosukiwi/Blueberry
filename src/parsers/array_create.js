/*
 * Array creation shortcut
 */
module.exports = function(obj) {
    'use strict';

    if(obj.type !== 'ARRAY_CREATE') {
        throw 'This is not an array creation!';
    }
    
    // The array can be empty
    if(obj.values[0] === '') {
        return 'array()';
    }

    var parser = require('./expression.js'),
        output,
        i,
        vals = [];

    output = 'array(';
    for(i = 0; i < obj.values.length; i += 1) {
        if(obj.values[i] === null) {
          continue;
        }

        vals.push(parser(obj.values[i]));
    }
    output += vals.join(', ') + ')';

    return output;
};
