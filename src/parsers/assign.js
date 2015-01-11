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

    scope.add(obj.identifier.value);
    
    if(obj.type === 'ASSIGN_TERNARY_OPERATOR') {
        return '$' + identifierParser(obj.identifier) + ' = ' + 
            expressionParser(obj.condition) + ' ? ' + expressionParser(obj.left) + ' : ' + expressionParser(obj.right) + ';';
    } 
    
    if(obj.type === 'ASSIGN_DEFAULT_VALUE') {
        return '$' + identifierParser(obj.identifier) + ' = ' + 
            expressionParser(obj.left) + ' ?: ' + expressionParser(obj.right) + ';';
    }

    var mode = obj.mode === 'BY_REFERENCE' ? '&=' : '=';
    return expressionParser(obj.identifier) + ' ' + mode + ' ' + expressionParser(obj.expression) + ';';
}

module.exports = assignParser;
