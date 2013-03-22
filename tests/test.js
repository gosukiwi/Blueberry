module.exports = {
    setUp: function (callback) {
        var parser = require('../src/grammar.js'),
            fs = require('fs');
        
        this.compile = function (source) {
            return parser.parse(source);
        };
        
        var statementParser = require('../src/parsers/statement.js');
        this.parseStatement = function (source) {
            return statementParser(this.compile(source)[0]);
        }

        this.load = function(name) {
            return fs.readFileSync(name, 'utf8');
        }

        this.compileFile = function(name) {
            var source = fs.readFileSync(name, 'utf8');
            var ast = this.compile(source);
            var i;
            var output = '';

            for(i = 0; i < ast.length; i++) {
                output += statementParser(ast[i]);
            }           
            
            return output;
        };

        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },

    assign: function (test) {
        test.equals(this.parseStatement('a = 1'), '$a = 1;');
        test.equals(this.parseStatement('a = 1 + 6'), '$a = (1 + 6);');
        test.equals(this.parseStatement('a = f(1 + 6)'), '$a = f((1 + 6));');
        test.equals(this.parseStatement('a = (age > 18)'), '$a = $age > 18;');
        test.done();
    },

    testIf: function (test) {
        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nend'),
            'if ($can_drink) {\necho(\'Beer Beer!\');\n}'
        );
        test.done();
    },

    testClass: function (test) {
        test.equals(
            this.compileFile('./tests/icedtea/class1.tea'),
            this.load('./tests/php/class1.php')
        );
        test.done();
    }
};

