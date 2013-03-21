/*
 * An identifier
 *  In IcedTea
 *      [a-zA-Z] [a-zA-Z_0-9]*
 */
module.exports = function(obj) {
    if(obj.type !== 'IDENTIFIER') {
        throw "This is not an identifier!";
    }

    return obj.value;
};
