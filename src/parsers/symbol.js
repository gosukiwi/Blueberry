/*
 * A symbol
 */
module.exports = function(obj) {
    if(obj.type !== 'SYMBOL') {
        throw "This is not a symbol!";
    }

    return "'" + obj.value + "'";
};
