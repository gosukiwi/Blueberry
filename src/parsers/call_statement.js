/*
 * A function called as a statement
 */
module.exports = function(obj) {
    if(obj.type !== 'CALL' && obj.type !== 'CALL_METHOD' 
            && obj.type !== 'CALL_PROPERTY' && obj.type !== 'CALL_CHAIN') {
        throw "This is not a function call!";
    }

    var callParser = require('./call_expression.js');
    return callParser(obj) + ';';
};
