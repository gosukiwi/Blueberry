/*
 * An associative array expressed as JSON
 */
module.exports = function(obj) {
    if(obj.type !== 'JSON_ARRAY') {
        throw "This is not a JSON array!";
    }

    var parser = require('./expression.js'),
        output,
        i,
        vals = [];

    output = 'array(';
    for(i = 0; i < obj.values.length; i += 1) {
        vals.push(parser(obj.values[i].name) + " => " + parser(obj.values[i].value));
    }
    output += vals.join(', ') + ')';

    return output;
};
