/*
 * An identifier
 *  In Blueberry
 *      [a-zA-Z] [a-zA-Z_0-9]*
 */
module.exports = function(obj) {
    if(obj.type !== 'IDENTIFIER' && obj.type !== 'INSTANCE_IDENTIFIER'
        && obj.type !== 'OBJECT_ATTRIBUTE_IDENTIFIER' && obj.type !== 'IDENTIFIER_BY_REFERENCE') {
        throw "This is not an identifier!";
    }

    return obj.value;
};
