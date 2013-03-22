/*
 * A function called as a statement
 */
module.exports = function(obj) {
    if(obj.type !== 'CALL' && obj.type !== 'CALL_METHOD') {
        throw "This is not a function call!";
    }

    var callParser = require('./call_expression.js');
    return callParser(obj) + ';';
};
