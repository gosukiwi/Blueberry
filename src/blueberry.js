/*
 * Blueberry is a programming language which compiles to PHP
 * Its designed to be a layer of syntactic sugar on top of good ol' PHP
 *
 * @author Federico Ramírez
 * @licence MIT
 */

'use strict';

var statementParser = require('./parsers/statement.js'),
    state           = require('./state.js'),
    pegjs_parser    = require('./grammar.js'),
    fs              = require('fs');

/*
 * Given bb source code, returns php source code
 */
var compile = function(code) {
  var i,
      output = '',
      ast;

  ast = pegjs_parser.parse(code);

  for (i = 0; i < ast.length; i += 1) {
    output += statementParser(ast[i]);
  }

  // Clean the state for the next compilation
  state.clear();

  return output;
};

/*
 * Given a file path, and an optional output, compiles the file and writes
 * the compiled code onto the output file.
 * If the output file is not defined, it will write the php code onto a new
 * file with the same name as the source but .php extension
 *
 * This function assumes the file exists.
 */
var compileFile = function(source, output) {
  var source_code,
      php_code;

  // Read the Blueberry source code
  source_code = fs.readFileSync(source, 'utf8');

  // Now I need to get all the code inside <?bb ?> tags (BB TAGS! Heh)
  // I use some javascript regex tricks, see: 
  // http://gosukiwi-blog.tumblr.com/post/46341523752/javascript-regular-expression-gotchas
  php_code = source_code.replace(/<\?bb([\s\S]*?)(\?>|(?![\s\S]))/g, function(match, bb_code, close_tag) {
    // Here bb_code is the value for the matched group 1 of the regular expression
    // And close_tag is the value for the matched group 2
    return '<?php\n' + compile(bb_code) + ((close_tag) ? '?>' : '');
  });

  // Finally write the php code to the output file
  output = output || source.substring(0, source.lastIndexOf('.')) + '.php';
  fs.writeFileSync(output, php_code);
};

module.exports = {
  compile: compile,
  compileFile: compileFile
};
