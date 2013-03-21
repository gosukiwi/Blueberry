var parser = require('./grammar.js'),
    fs = require('fs');

var source = fs.readFileSync(process.argv[2], 'utf8');
var ast = parser.parse(source);

var statementParser = require('./parsers/statement.js');
var i;
var output = '';

for(i = 0; i < ast.length; i++) {
    output += statementParser(ast[i]);
}

console.log(output);
