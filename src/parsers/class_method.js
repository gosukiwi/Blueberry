/*
 * A class method statement
 */


var parseIdentifier = require('./identifier.js');
var parseArguments  = require('./arguments.js');
var parseStatement  = require('./statement.js');
var scope           = require('../state.js');

function addArgumentsToScope(args) {
  if(args === null) {
    return;
  }

  var len = args.values.length;
  for(var i = 0; i < args.values.length; i += 1) {
    scope.add(args.values[i].value);
  }
}

module.exports = function(obj, access) {
    var output;
    var name = parseIdentifier(obj.name);
    scope.enterFunction(name);
    addArgumentsToScope(obj.args);

    switch(obj.type) {
      case 'DEF':
        output = scope.indentate() + access + ' function ' + name + '(' + parseArguments(obj.args) + ') {\n';
        break;
      case 'STATIC_DEF':
        output = scope.indentate() + 'public static function ' + name + '(' + parseArguments(obj.args) + ') {\n';
        break;
      default:
        throw 'Invalid method, can only be DEF or STATIC_DEF';
    }

    scope.indent();
    
    for(var i = 0; i < obj.statements.length; i += 1) {
      output += parseStatement(obj.statements[i]);
    }

    scope.dedent();
    scope.leaveFunction();

    output += scope.indentate() + "}";

    // Methods get one extra new line at the very top for more readability
    return "\n" + output;
};
