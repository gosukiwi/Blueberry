/*
 * An empty space, newline or tab
 */
module.exports = function(obj) {
    if(obj.type !== 'EMPTY') {
        throw "This is not empty!";
    }

    return obj.value;
};
