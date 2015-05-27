/*
 * An string
 */

var expressionParser = require('./expression'),
    pegjs_parser     = require('../grammar.js');

module.exports = function(obj) {
    if(obj.type !== 'STRING') {
        throw "This is not a string!";
    }

    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    var output = "'" + obj.value.replace(/'/g, "\\'") + "'";
    var regex  = /#\{(.*?)\}/g;
    var match  = regex.exec(obj.value);

    if(match === null)
      return output;

    var code,
        value,
        r;
    while(match !== null) {
      code = "tmp = " + match[1];
      try {
        value = pegjs_parser.parse(code)[0].expression;
        value = "' . " + expressionParser(value) + " . '";
        r = new RegExp(escapeRegExp(match[0]), 'g');
        output = output.replace(r, value);
      } catch(err) {
      } finally {
        match = regex.exec(obj.value);
      }
    }

    return output;
};
