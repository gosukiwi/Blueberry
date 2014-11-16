/*
 * A number
 */
module.exports = function(obj) {
    if(obj.type !== 'NUMBER') {
        throw "This is not a number!";
    }

    return parseInt(obj.value, 10);
};
