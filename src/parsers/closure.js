/**
 * Anonymous function with implicit return.
 * (args) use (uses) -> body
 *
 * eg:
 * (a) -> 2*a
 * (a) -> do 2*a end
 */

var parseStatement = require('./statement.js');

function parseBlock(block) {
  var i, 
      len = block.length;
      output = '';

  for(i = 0; i < len; i += 1) {
    output += parseStatement(block[i]);
  }

  return output;
}

module.exports = function(obj) {
    if(obj.type !== 'CLOSURE') {
        throw "This is not a closure!";
    }

    var parseIdentifier = require('./identifier.js'),
        parseArguments = require('./arguments.js'),
        parseExpression = require('./expression.js'),
        output;

    output = 'function(' + parseArguments(obj.args) + ') ';

    if(obj.use !== null) {
      output += 'use (' + parseArguments(obj.use) + ') ';
    }

    if(obj.body.type === 'CLOSURE_BLOCK') {
      output += "{\n" + parseBlock(obj.body.block) + "\n}";
    } else {
      output += '{ return ' + parseExpression(obj.body) + '; }';
    }

    return output;
};
