/*
 * A def
 *  In Blueberry
 *      def myIdentifier
 *          body
 *      end
 *
 *  In PHP
 *      function myIdentifier() {
 *          body
 *      }
 */

var parseIdentifier = require('./identifier.js'),
    parseArguments  = require('./arguments.js'),
    parseStatement  = require('./statement.js'),
    scope           = require('../state.js');

function addArgumentsToScope(args) {
  if(args === null) {
    return;
  }

  var len = args.values.length;
  for(var i = 0; i < args.values.length; i += 1) {
    scope.add(args.values[i].value);
  }
}

module.exports = function(obj) {
  if(obj.type !== 'DEF') {
    throw "This is not a def!";
  }

  var functionName = parseIdentifier(obj.name),
      output,
      i;

  // Scope lookup
  scope.enterFunction(functionName);
  addArgumentsToScope(obj.args);

  output = 'function ' + functionName + '(' + parseArguments(obj.args) + ') {\n';

  for(i = 0; i < obj.statements.length; i += 1) {
    output += parseStatement(obj.statements[i]);
  }

  output += "}";

  scope.leaveFunction();

  return output;
};
