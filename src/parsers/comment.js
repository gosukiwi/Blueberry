/*
 * A comment
 */
module.exports = function(obj) {
    if(obj.type !== 'COMMENT') {
        throw "This is not a comment!";
    }

    return "// " + obj.value + "\n";
};
