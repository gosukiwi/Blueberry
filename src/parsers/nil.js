/*
 * A nil
 */
module.exports = function(obj) {
    if(obj.type !== 'NIL') {
        throw "This is not nil!";
    }

    return 'null';
};
