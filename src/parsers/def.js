/*
 * A def
 *  In IcedTea
 *      def myIdentifier
 *          body
 *      end
 *
 *  In PHP
 *      function myIdentifier() {
 *          body
 *      }
 */
module.exports = function(obj) {
    if(obj.type !== 'DEF') {
        throw "This is not a def!";
    }

    var parseIdentifier = require('./identifier.js'),
        parseArguments = require('./arguments.js'),
        parseStatement = require('./statement.js'),
        output,
        i;

    output = 'function ' + parseIdentifier(obj.name) + ' (' + parseArguments(obj.args) + ') {\n';
    
    for(i = 0; i < obj.statements.length; i += 1) {
        output += parseStatement(obj.statements[i]);
    }

    output += "}\n";

    return output;
};
