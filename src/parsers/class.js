/*
 * A Class
 */

var identifierParser = require('./identifier');
var scope            = require('../state.js');

module.exports = function(obj) {
    if(obj.type !== 'CLASS') {
        throw "This is not a class!";
    }

    var classBlockParser = require('./class_block.js');
    var output;
    var name = identifierParser(obj.name);

    scope.enterFunction(name);

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

    return output;
};
