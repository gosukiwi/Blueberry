/*
 * A function called as an expression
 */
var outter_parser = function(obj) {
   var identifierParser = require('./identifier.js'),
        argumentsParser = require('./expressionList.js'),
        output;
   
   switch(obj.type) {
        case 'CALL':
            output = identifierParser(obj.identifier) + '(' + argumentsParser(obj.args) + ')';
            break;
        case 'CALL_CHAIN':
            output = outter_parser(obj.left) + '->' + outter_parser(obj.right);
            break;
        case 'CALL_METHOD':
            output = '$' + identifierParser(obj.object) + "->" + outter_parser(obj.method);
            break;
        case 'CALL_PROPERTY':
            output = '$' + identifierParser(obj.object) + "->" + identifierParser(obj.property);
            break;
        case 'IDENTIFIER':
            return identifierParser(obj);
            break;
        default:
            throw "Invalid type: " + obj.type;
            break;
    }

   return output;
};

module.exports = outter_parser;

