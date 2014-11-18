/*
 * An array identifier
 * Access an array index
 */

var expressionParser = require('./expression.js');
module.exports = function(obj) {
    'use strict';

    if(obj.type !== 'ARRAY_IDENTIFIER') {
        throw 'This is not an array identifier!';
    }

    return expressionParser(obj.name) + '[' + expressionParser(obj.index) + ']';
};
