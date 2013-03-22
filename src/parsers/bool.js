/*
 * An empty space, newline or tab
 */
module.exports = function(obj) {
    if(obj.type !== 'BOOL') {
        throw "This is not a boolean value!";
    }

    return obj.value;
};
