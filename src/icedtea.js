/*
 * IcedTea is a programming language which compiles to PHP
 * Its designed to be a layer of syntactic sugar on top of good ol' PHP
 * @author Federico Ramírez
 * @licence MIT
 */

(function () {
    "use strict";

    var fs = require('fs'),
        command = process.argv[2],
        get_argument,
        compile,
        compileFile,
        commands;

    /*
     * Gets the command line argument with the given index
     */
    get_argument = function (idx) {
        return process.argv[idx + 2];
    };

    /*
     * Given tea source code, returns php source code
     */
    compile = function(code) {
        var statementParser = require('./parsers/statement.js'),
            pegjs_parser = require('./grammar.js'),
            i,
            output = '',
            ast = pegjs_parser.parse(code);

        for (i = 0; i < ast.length; i += 1) {
            output += statementParser(ast[i]);
        }

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
    compileFile = function(source, output) {
        var source_code,
            php_code;
         
        // Read the Iced Tea source code
        source_code = fs.readFileSync(source, 'utf8');
    
        // Now I need to get all the code inside <?tea ?> tags (TEA TAGS! Heh)
        php_code = source_code.replace(/<\?tea([\s\S]*?)\?>/g, function(match, tea_code) {
            return '<?php' + compile(tea_code) + '?>';
        });
    
        // Finally write the php code to the output file
        output = output || source.substring(0, source.lastIndexOf('.')) + '.php';
        fs.writeFileSync(output, php_code);
    };
    
    commands = {};
    commands.compile = function() {
        var source = get_argument(1),
            output = get_argument(2),
            files,
            i,
            stats,
            new_file;
    
        stats = fs.statSync(source);
    
        // If the path is a file, just compile it
        if (stats.isFile()) {
            compileFile(source, output);
        } else if (stats.isDirectory()) {
            // All the files inside the directory
            files = fs.readdirSync(source);
            // The output folder, if no output defined or invalid, use source
            if(!output || !fs.statSync(output).isDirectory()) {
                output = source;
            }
    
            for (i = 0; i < files.length; i += 1) {
                if (files[i].substring(files[i].lastIndexOf('.')) === '.tea') {
                    // The new name of the file
                    new_file = files[i].substring(0, files[i].lastIndexOf('.')) + '.php';
                    // Compile it!
                    compileFile(source + '/' + files[i], output + '/' + new_file);
                }
            }
        } else {
            console.log('Invalid path, only files and directories can be compiled');
            process.exit(1);
        }
    };
    
    // Check if the passed command exists
    if (!command || !commands[command]) {
        console.log('Invalid command: ' + command);
        process.exit(1);
    }
    
    // Finally, execute the desired command
    commands[command]();
}());
