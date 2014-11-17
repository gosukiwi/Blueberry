/*
 * An string
 */
module.exports = function(obj) {
    if(obj.type !== 'STRING') {
        throw "This is not a string!";
    }

    return "'" + obj.value.replace(/'/g, "\\'") + "'";
};
