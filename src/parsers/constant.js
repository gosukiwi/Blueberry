/*
 * An identifier
 *  In Blueberry
 *      [A-Z] [A-Z_0-9]*
 */

function constantParser(obj) {
    'use strict';

    if(obj.type !== 'CONSTANT') {
        throw 'This is not a constant!';
    }

    return obj.value;
}

module.exports = constantParser;
