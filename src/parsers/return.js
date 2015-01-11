/*
 * A return
 */
module.exports = function(obj) {
    if(obj.type !== 'RETURN') {
        throw "This is not an if!";
    }

    var expressionParser = require('./expression.js');
    return 'return ' + expressionParser(obj.exp) + ';';
};
