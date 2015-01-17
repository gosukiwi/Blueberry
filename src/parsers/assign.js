/*
 * Assignment
 *  In Blueberry:
 *      a = 1
 *  In PHP:
 *      $a = 1;
 */

var expressionParser = require('./expression.js'),
    identifierParser = require('./identifier.js'),
    scope            = require('../state.js');

function assignParser(obj) {
    'use strict';

    if(obj.type !== 'ASSIGN' && obj.type !== 'ASSIGN_INSTANCE_VARIABLE' && obj.type !== 'ASSIGN_TERNARY_OPERATOR' && obj.type !== 'ASSIGN_DEFAULT_VALUE') {
        throw 'This is not an assignment!';
    }

    if(obj.type === 'ASSIGN_INSTANCE_VARIABLE') {
        return '$this->' + assignParser(obj.assignment).substring(1);
    } 

    var output,
        mode;

    if(obj.type === 'ASSIGN_TERNARY_OPERATOR') {
        output = '$' + identifierParser(obj.identifier) + ' = ' + 
            expressionParser(obj.condition) + ' ? ' + expressionParser(obj.left) + ' : ' + expressionParser(obj.right) + ';';
    } else if(obj.type === 'ASSIGN_DEFAULT_VALUE') {
        output = '$' + identifierParser(obj.identifier) + ' = ' + expressionParser(obj.left) + ' ?: ' + expressionParser(obj.right) + ';';
    } else {
      mode   = obj.mode === 'BY_REFERENCE' ? '&=' : '=';
      output = expressionParser(obj.identifier) + ' ' + mode + ' ' + expressionParser(obj.expression) + ';';
    }

    // Add variable name to scope
    scope.add(obj.identifier.value);

    return output;
}

module.exports = assignParser;
