/*
 * A comment
 */
module.exports = function(obj) {
    if(obj.type !== 'COMMENT') {
        throw "This is not a comment!";
    }

    if(obj.multiline) {
        return '/*' + obj.value + '*/';
    } else {
        return "// " + obj.value;
    }
};
