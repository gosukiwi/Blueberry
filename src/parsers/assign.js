/*
 * Assignment
 *  In Blueberry:
 *      a = 1
 *  In PHP:
 *      $a = 1;
 */

var expressionParser = require('./expression.js'),
    identifierParser = require('./identifier.js'),
    constantParser   = require('./constant.js'),
    scope            = require('../state.js');

function assignParser(obj) {
    'use strict';

    var possible_assignments = ['ASSIGN', 'ASSIGN_INSTANCE_VARIABLE',
      'ASSIGN_TERNARY_OPERATOR', 'ASSIGN_DEFAULT_VALUE', 'ASSIGN_CONSTANT'];
    if(possible_assignments.indexOf(obj.type) === -1) {
        throw 'This is not an assignment!';
    }

    // Instance
    if(obj.type === 'ASSIGN_INSTANCE_VARIABLE') {
        return '$this->' + assignParser(obj.assignment).substring(1);
    }

    var output;

    if(obj.type === 'ASSIGN_CONSTANT') {
      output = "const " + constantParser(obj.identifier) + " = " + expressionParser(obj.expression) + ";";
    } else if(obj.type === 'ASSIGN_TERNARY_OPERATOR') {
      output = '$' + identifierParser(obj.identifier) + ' = ' +
      expressionParser(obj.condition) + ' ? ' + expressionParser(obj.left) + ' : ' + expressionParser(obj.right) + ';';
    } else if(obj.type === 'ASSIGN_DEFAULT_VALUE') {
      output = '$' + identifierParser(obj.identifier) + ' = ' + expressionParser(obj.left) + ' ?: ' + expressionParser(obj.right) + ';';
    } else {
      var mode = obj.mode === 'BY_REFERENCE' ? '&=' : '=';
      output = expressionParser(obj.identifier) + ' ' + mode + ' ' + expressionParser(obj.expression) + ';';
    }

    // Add variable name to scope
    scope.add(obj.identifier.value);

    return output;
}

module.exports = assignParser;
