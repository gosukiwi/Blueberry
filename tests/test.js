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
        test.equals(this.parseStatement('a = age > 18'), '$a = $age > 18;');
        test.done();
    },

    testIf: function (test) {
        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nend'),
            'if ($can_drink) {\necho(\'Beer Beer!\');\n}'
        );

        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nelse\necho("Juice")\nend'),
            'if ($can_drink) {\necho(\'Beer Beer!\');\n} else {\necho(\'Juice\');\n}'
        );

        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($can_drink) {\necho(\'Beer Beer!\');\n} else if ($age < 6) {\necho(\'Milk\');\n} else {\necho(\'Juice\');\n}'
        );

        test.done();
    },

    testBool: function (test) {
        test.equals(
            this.parseStatement('a = true'),
            '$a = true;'
        );

        test.equals(
            this.parseStatement('a = false'),
            '$a = false;'
        );

        test.done();
    },

    testNil: function (test) {
        test.equals(
            this.parseStatement('a = nil'),
            '$a = null;'
        );
        test.done();
    },


    testWhile: function (test) {
        test.equals(
            this.parseStatement('while a\nb = 1\nend'),
            'while ($a) {\n$b = 1;\n}'
        );

        test.equals(
            this.parseStatement('while age > 18\nb = 1\nend'),
            'while ($age > 18) {\n$b = 1;\n}'
        );

        test.done();
    },

    testClass: function (test) {
        test.equals(
            this.compileFile('./tests/icedtea/class1.tea'),
            this.load('./tests/php/class1.php')
        );
        test.done();
    },

    testConcat: function (test) {
        test.equals(
            this.parseStatement('a = "Hello" & this.name\n'),
            '$a = \'Hello\' . $this->name;'
        );
        test.done();
    },

    testSwitch: function (test) {
        test.equals(
            this.compileFile('./tests/icedtea/switch1.tea'),
            this.load('./tests/php/switch1.php')
        );
        test.done();
    },

    testNot: function (test) {
        test.equals(
            this.parseStatement('a = not true'),
            '$a = !true;'
        );

        test.equals(
            this.parseStatement('if not age > 18\ncannotDrink()\nend'),
            'if (!$age > 18) {\ncannotDrink();\n}'
        );

        test.done();
    },


    testTernaryOperator: function (test) {
        test.equals(
            this.parseStatement('a = var ? 1 : 2'),
            '$a = $var ? 1 : 2;'
        );

        test.done();
    },

    testDefaultValue: function (test) {
        test.equals(
            this.parseStatement('a = var ?? 2'),
            '$a = $var ? $var : 2;'
        );

        test.done();
    },

    testRange: function(test) {
        test.equals(
            this.parseStatement('a = (0..10)'),
            '$a = range(0, 10);'
        );

        test.done();
    },

    testFor: function (test) {
        test.equals(
            this.parseStatement('for i in (0..10)\necho(i)\nend'),
            'foreach (range(0, 10) as $i) {\necho($i);\n}'
        );

        test.equals(
            this.parseStatement('for k, v in {\'a\': 1}\necho(k)\nend'),
            'foreach (array(\'a\' => 1) as $k, $v) {\necho($k);\n}'
        );

        test.done();
    },

    testJSON: function (test) {
        test.equals(
            this.parseStatement('a = { "name": "Mike", "meta": { "age": 18 } }'),
            '$a = array(\'name\' => \'Mike\', \'meta\' => array(\'age\' => 18));'
        );

        test.done();
    },

    testArray: function (test) {
        test.equals(
            this.parseStatement('a = [1, "two", [f(x)]]'),
            '$a = array(1, \'two\', array(f($x)));'
        );

        test.done();
    },

    testTry: function (test) {
        test.equals(
            this.parseStatement('try\na=1\ncatch error\nb=2\nfinally\nc=3\nend'),
            'try {\n$a = 1;\n} catch (Exception $error) {\n$b = 2;\n} finally {\n$c = 3;\n}'
        );

        test.equals(
            this.parseStatement('try\na=1\ncatch\nb=2\nfinally\nc=3\nend'),
            'try {\n$a = 1;\n} catch (Exception $ex) {\n$b = 2;\n} finally {\n$c = 3;\n}'
        );

        test.equals(
            this.parseStatement('try\na=1\ncatch\nb=2\nend'),
            'try {\n$a = 1;\n} catch (Exception $ex) {\n$b = 2;\n}'
        );

        test.done();
    },

    testClassAcessModifier: function (test) {
        test.equals(
            this.parseStatement('class MyClass\nprivate @var1\nprivate @var2 = 1\nend'),
            'class MyClass {\nprivate $var1;\nprivate $var2 = 1;\n}'
        );

        test.equals(
            this.parseStatement('class MyClass\nprivate @var1\nprivate def PrivateMethod\na = 1\nend\nend'),
            'class MyClass {\nprivate $var1;\nprivate function PrivateMethod () {\n$a = 1;\n}\n}'
        );

        test.equals(
            this.parseStatement('class MyClass\nprivate @var1\ndef PublicMethod\na = 1\nend\nend'),
            'class MyClass {\nprivate $var1;\npublic function PublicMethod () {\n$a = 1;\n}\n}'
        );

        test.done();
    },

    testClassInheritance: function (test) {
        test.equals(
            this.parseStatement('class A < B\nend'),
            'class A extends B {\n}'
        );

        test.done();
    },

    testIdentifierByReference: function (test) {
        test.equals(
            this.parseStatement('def myFunc (&var, var2)\nend'),
            'function myFunc (&$var, $var2) {\n}'
        );

        test.done();
    }
};

