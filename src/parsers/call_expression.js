/*
 * A function called as an expression
 */

var identifierParser = require('./identifier.js'),
    argumentsParser  = require('./expressionList.js'),
    expressionParser = require('./expression.js');

function callExpressionParser(obj) {
  'use strict';

   var output;

   switch(obj.type) {
        case 'CALL':
            output = identifierParser(obj.identifier) + '(' + argumentsParser(obj.args) + ')';
            break;
        case 'CALL_CHAIN':
            output = expressionParser(obj.left) + '->' + callExpressionParser(obj.right);
            break;
        case 'CALL_METHOD':
            output = expressionParser(obj.object) + '->' + callExpressionParser(obj.method);
            break;
        case 'CALL_PROPERTY':
            output = expressionParser(obj.object) + '->' + expressionParser(obj.property).substring(1);
            break;
        case 'IDENTIFIER':
            return identifierParser(obj);
        default:
            throw 'Invalid type: ' + obj.type;
    }

   return output;
}

module.exports = callExpressionParser;
