/*
 * A real number
 */
module.exports = function(obj) {
    if(obj.type !== 'REAL_NUMBER') {
        throw "This is not a real number!";
    }

    return parseFloat(obj.value, 10);
};
