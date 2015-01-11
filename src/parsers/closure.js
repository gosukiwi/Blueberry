/**
 * Anonymous function with implicit return.
 * (args) use (uses) -> body
 *
 * eg:
 * (a) -> 2*a
 * (a) -> do 2*a end
 */

var parseStatement  = require('./statement.js'),
    parseIdentifier = require('./identifier.js'),
    parseArguments  = require('./arguments.js'),
    parseExpression = require('./expression.js'),
    scope           = require('../state.js');

function parseBlock(block) {
  var i, 
      len = block.length;
      output = '';

  for(i = 0; i < len; i += 1) {
    output += parseStatement(block[i]);
  }

  return output;
}

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
  if(obj.type !== 'CLOSURE') {
    throw "This is not a closure!";
  }

  // set up scope
  scope.enterFunction('closure');
  addArgumentsToScope(obj.args);

  var output = 'function(' + parseArguments(obj.args) + ') ';

  if(obj.use !== null) {
    addArgumentsToScope(obj.use);
    output += 'use (' + parseArguments(obj.use) + ') ';
  }

  if(obj.body.type === 'CLOSURE_BLOCK') {
    output += "{\n" + parseBlock(obj.body.block) + "\n}";
  } else {
    output += '{ return ' + parseExpression(obj.body) + '; }';
  }

  scope.leaveFunction('closure');

  return output;
};
