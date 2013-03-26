/*
 * A Class
 */
module.exports = function(obj) {
    if(obj.type !== 'CLASS') {
        throw "This is not a class!";
    }

    var identifierParser = require('./identifier.js'),
        statementParser = require('./statement.js'),
        classAttributeParser = require('./class_attribute.js'),
        output,
        i;

    if(obj.extends === null) {
        output = 'class ' + identifierParser(obj.name) + ' {\n'; 
    } else {
        output = 'class ' + identifierParser(obj.name) + ' extends ' + identifierParser(obj.extends) + ' {\n'; 
    }

    // Parse attributes
    for(i = 0; i < obj.attributes.length; i += 1) {
        output += classAttributeParser(obj.attributes[i]);
    }

    // Parse defs
    for(i = 0; i < obj.block.length; i += 1) {
        output += statementParser(obj.block[i]);
    }

    output += '}';

    return output;
};
