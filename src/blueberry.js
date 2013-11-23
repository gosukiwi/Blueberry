/*
 * Blueberry is a programming language which compiles to PHP
 * Its designed to be a layer of syntactic sugar on top of good ol' PHP
 * @author Federico Ramírez
 * @licence MIT
 */

(function () {
    "use strict";

    var fs = require('fs'),
        node_path = require('path'),
        chokidar = require('chokidar'),
        mkpath = require('mkpath'),
        command = process.argv[2],
        get_argument,
        compile,
        compileFile,
        walk,
        commands,
        VERSION = '0.2.0';

    /*
     * Gets the command line argument with the given index
     */
    get_argument = function (idx) {
        return process.argv[idx + 2];
    };

    /*
     * Given bb source code, returns php source code
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
    
        // Now I need to get all the code inside <?bb ?> tags (BB TAGS! Heh)
        // I use some javascript regex tricks, see: 
        // http://gosukiwi-blog.tumblr.com/post/46341523752/javascript-regular-expression-gotchas
        php_code = source_code.replace(/<\?bb([\s\S]*?)(\?>|(?![\s\S]))/g, function(match, tea_code, close_tag) {
            // Here tea_code is the value for the matched group 1 of the regular expression
            // And close_tag is the value for the matched group 2
            return '<?php' + compile(tea_code) + ((close_tag) ? '?>' : '');
        });
    
        // Finally write the php code to the output file
        output = output || source.substring(0, source.lastIndexOf('.')) + '.php';
        fs.writeFileSync(output, php_code);
    };

    /*
    * Walk a directory in a recursive and parallel way
    * usage: walk(dir, function(err, file_list) {});
    */
    walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) {
                return done(err);
            }

            var pending = list.length;

            if (!pending) {
                return done(null, results);
            }

            list.forEach(function(file) {
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
                        results.push(file);
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    };
    
    // commands "namespace"
    commands = {};

    /*
     * Watches for a file or folder, when they change, compile to passed
     * output
     */
    commands.watch = function () {
        var input = get_argument(1),
            output = get_argument(2),
            is_dir,
            new_file,
            watcher;

        /*
         * Compiles a file
         * path: The full path of the file
         * input: The input base directory
         * output: The output base directory
         */
        function compile_file(path, input, output) {
            // The difference between the file and the base input
            var difference = path.substr(input.length),
            // The new path is the output + the file to be created
                new_path = (output + difference).replace('.bb', '.php');

            // Create all required directories
            mkpath.sync(node_path.dirname(new_path));
            // Compile the file
            compileFile(path, new_path);

            console.log('Compiled ' + difference);
        }

        if(!fs.existsSync(input)) {
            console.log('The path ' + input + ' does not exist');
            process.exit(1);
        }

        // Whether the input path is a directory or a file
        is_dir = fs.statSync(input).isDirectory();

        if(!output) {
            if(is_dir) {
                output = input;
            } else {
                output = input.substring(0, input.lastIndexOf('.')) + '.php';
            }
        }

        // Start watching on change and add events
        watcher = chokidar.watch(input, { ignored: /^\./, persistent: true });
        watcher.on('change', function (path) {
            compile_file(path, input, output);
        });
        watcher.on('add', function (path) {
            compile_file(path, input, output);
        });

        console.log('Watching ' + input + "\nUse <CTRL>+<C> to exit");
    };

    /*
     * Clean a directory recursively of all .php files
     * THIS IS DESTRUCTIVE SO BE CAREFUL! This is intended to be used when
     * you compile in your working directory by error, so you can clean all
     * .php files
     */
    commands.clean = function () {
        var source = get_argument(1);

        if(!fs.statSync(source).isDirectory()) {
            console.log(source + ' is not a directory.');
            process.exit(1);
        }

        walk(source, function(err, files) {
            var i,
                cur_file,
                dot_idx,
                tea_file;

            for(i = 0; i < files.length; i += 1) {
                cur_file = files[i];
                dot_idx = cur_file.lastIndexOf('.');

                // Check if the file is a .php file
                if(cur_file.substring(dot_idx) === '.php') {
                    // Now check if there's a .bb file with the same name
                    tea_file = cur_file.substring(0, dot_idx) + '.bb';
                    if(files.indexOf(tea_file) !== -1) {
                        // If there's a file, delete the php file
                        fs.unlink(cur_file);
                    }
                }
            }
        });
    };

    /*
     * Shows the CLI help text
     * usage: help
     */
    commands.help = function () {
        var command = get_argument(1),
            message;

        if(command) {
            command = (command + '').toLowerCase();
        }
        
        message = 'Blueberry compiles bb source code to PHP\n' +
            'It has four commands: watch, compile, clean and help\n' +
            'Use "bb help <command>" to get help on a specific topic.\n'; 

        if(command === 'compile') {
            message = 'This command compiles a file or a folder to PHP\n' +
                'Usage: bb compile <myFile> [myOutputFile]\n' +
                '       bb compile <myFolder/> [myOutputFolder/]';
        }

        console.log(message);
    };

    /*
     * Outputs the current version
     */
    commands.version = function () {
        console.log('Blueberry version: ' + VERSION);
    }

    /*
     * Compiles a file or all the files in a directory
     * usage: compile input [output]
     *
     * input can be a file or directory, if directory recursively compiles
     * all .bb files
     * If the output is not defined it will compile in the same path and
     * only change the extension to .php
     */
    commands.compile = function() {
        var source = get_argument(1),
            output = get_argument(2),
            i,
            stats,
            new_file,
            new_file_dir,
            source_path_start;

        if(!source) {
            console.log('No input file specified, usage:\ntea compile myFile.bb [myOutput.php]\ntea compile myDir/ myOutDir/');
            process.exit(1);
        }

        stats = fs.statSync(source);
    
        // If the path is a file, just compile it
        if (stats.isFile()) {
            compileFile(source, output);
        } else if (stats.isDirectory()) {
            // Check for valid output path
            if(output && !fs.existsSync(output)) {
                console.log('The output path ' + output + ' does not exist.');
                process.exit(1);
            }

            // The output folder, if no output defined or invalid, use source
            if(!output || !fs.statSync(output).isDirectory()) {
                output = source;
            } 

            // Here we store the length in characters of the path, so later on 
            // we know the base of our path
            source_path_start = source.length;

            walk(source, function(err, files) {
                for (i = 0; i < files.length; i += 1) {
                    if (files[i].substring(files[i].lastIndexOf('.')) !== '.bb') {
                        continue;
                    }

                    // The new name of the file
                    new_file = files[i].substring(0, files[i].lastIndexOf('.')) + '.php';
                    // Now replace the paths
                    new_file = output + new_file.substring(source_path_start);
                    // If on windows, replace \ with /
                    new_file = new_file.replace('\\', '/');

                    // Check if the output folder exists
                    new_file_dir = new_file.substring(0, new_file.lastIndexOf('/'));
                    if(!fs.existsSync(new_file_dir)) {
                        fs.mkdirSync(new_file_dir);
                    }

                    // And compile it!
                    compileFile(files[i], new_file);
                }
            });
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
