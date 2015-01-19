/*
 * A Class
 */

var identifierParser = require('./identifier');
var classBlockParser = require('./class_block.js');
var scope            = require('../state.js');

module.exports = function(obj) {
  if(obj.type !== 'CLASS') {
      throw "This is not a class!";
  }

  var output;
  var name = identifierParser(obj.name);

  scope.enterFunction(name);
  scope.indent();

  if(obj.extends === null) {
    output = 'class ' + name + ' {\n'; 
  } else {
    output = 'class ' + name + ' extends ' + identifierParser(obj.extends) + ' {\n'; 
  }

  var len = obj.block.length;
  for(var i = 0; i < len; i += 1) {
    output += classBlockParser(obj.block[i]);
  }

  output += '}';

  scope.leaveFunction();
  scope.dedent();

  return output;
};
