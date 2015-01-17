/*
 * A class block. Contains a bunch of attributes and methods.
 */

var attributeParser = require('./class_attribute.js');
var methodParser    = require('./class_method.js');

function parseBlockStatement(stmt, access) {
    switch(stmt.type) {
      case 'CLASS_ATTRIBUTE':
      case 'CLASS_STATIC_ATTRIBUTE':
        return attributeParser(stmt, access);
      case 'DEF':
      case 'STATIC_DEF':
        return methodParser(stmt, access);
      default:
        throw "Invalid type: " + stmt.type;
    }
}

module.exports = function(obj) {
  if(obj.type !== 'CLASS_METHOD_BLOCK') {
    throw 'This is not a class method block!';
  }

  var output = '';
  var access = obj.access;

  var len = obj.statements.length;
  for(var i = 0; i < len; i += 1) {
    var statement = obj.statements[i];
    output += parseBlockStatement(statement, access) + "\n";
  }

  return output;
};
