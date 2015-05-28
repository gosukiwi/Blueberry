/**
 * Instance of binop
 */

 var expressionParser = require('./expression.js');
 var identifierParser = require('./identifier.js');

 module.exports = function(obj) {
     if(obj.type !== 'INSTANCEOF') {
         throw "This is not an arithmetic expression!";
     }

     return '(' + expressionParser(obj.left) + ' instanceof ' + identifierParser(obj.right) + ')';
 };
