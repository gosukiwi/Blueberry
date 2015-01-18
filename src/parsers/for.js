/*
 * A for
 */

var expressionParser = require('./expression.js');
var identifierParser = require('./identifier.js');
var statementParser  = require('./statement.js');
var scope            = require('../state.js');

module.exports = function(obj) {
  if(obj.type !== 'FOR' && obj.type !== 'COMPOSITE_FOR') {
      throw "This is not a for!";
  }

  var output;
  scope.indent();

  if(obj.type === 'COMPOSITE_FOR') {
    output = 'foreach (' + expressionParser(obj.collection) + ' as $' + identifierParser(obj.key) + ' => $' + identifierParser(obj.value) + ') {\n';
  } else {
    // foreach over range() is inefficient - where possible, we can optimise it to a plain for loop
    if (obj.collection.type === 'RANGE' && obj.collection.from.type === 'NUMBER' && obj.collection.to.type === 'NUMBER') {
      var direction = obj.collection.to.value > obj.collection.from.value;
      output = 'for ($' + identifierParser(obj.name) + ' = ' + expressionParser(obj.collection.from) 
          + '; $' + identifierParser(obj.name) + ' ' + (direction ? '<=' : '>=') + ' ' 
          + expressionParser(obj.collection.to) + '; $' + identifierParser(obj.name) + (direction ? '++' : '--') + ') {\n'; 
    } else {
      output = 'foreach (' + expressionParser(obj.collection) + ' as $' + identifierParser(obj.name) + ') {\n';
    }
  }

  for(var i = 0; i < obj.body.length; i += 1) {
    output += statementParser(obj.body[i]);
  }

  output += '}';

  scope.dedent();

  // Separate this statement from the others with extra new lines
  return output;
};
