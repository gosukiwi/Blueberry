'use strict';

module.exports = {
    setUp: function (callback) {
        var parser = require('../src/grammar.js'),
            src = require('../src/blueberry.js'),
            fs = require('fs'),
            glob = require('glob');
        
        this.compile = function (source) {
            return parser.parse(source);
        };
        
        var statementParser = require('../src/parsers/statement.js');
        this.parseStatement = function (source) {
            return statementParser(this.compile(source)[0]);
        };

        this.load = function (name) {
            return this.unixNewlines(fs.readFileSync(name, 'utf8'));
        };

        this.save = function (name, data) { 
            return fs.writeFileSync(name, data, { encoding: 'utf8' });
        };

        this.delete = function (name) {
            return fs.unlinkSync(name);
        };

        this.unixNewlines = function (str) {
            return str.replace(/\r\n/g, '\n');
        };

        this.compileFile = function(name) {
            var source = fs.readFileSync(name, 'utf8');
            var ast = this.compile(source);
            var i;
            var output = '';

            for(i = 0; i < ast.length; i++) {
                output += statementParser(ast[i]);
            }           
            
            return this.unixNewlines(output);
        };

        this.compileBlueberry = src.compileFile;

        this.glob = glob.sync;

        callback();
    },

    tearDown: function (callback) {
        // clean up
        callback();
    },

    testPrimitives: function (test) {
        test.equals(this.parseStatement('a = 1'), '$a = 1;');
        test.equals(this.parseStatement('a = 1.5'), '$a = 1.5;');
        test.equals(this.parseStatement('a = "asd"'), '$a = \'asd\';');
        test.equals(this.parseStatement('a = "this has a\nnewline"'), '$a = \'this has a\nnewline\';');
        // only double quotes for now
        //test.equals(this.parseStatement('a = \'asd\''), '$a = \'asd\';');
        test.done();
    },

    testAssign: function (test) {
        test.equals(this.parseStatement('a = 1'), '$a = 1;');
        test.equals(this.parseStatement('a = 1 + 6'), '$a = (1 + 6);');
        test.equals(this.parseStatement('a = 1 - 6'), '$a = (1 - 6);');
        test.equals(this.parseStatement('a = 1 * 6'), '$a = (1 * 6);');
        test.equals(this.parseStatement('a = 1 / 6'), '$a = (1 / 6);');
        test.equals(this.parseStatement('a = 1 % 6'), '$a = (1 % 6);');
        test.equals(this.parseStatement('a = f(1 + 6)'), '$a = f((1 + 6));');
        test.equals(this.parseStatement('a = age > 18'), '$a = $age > 18;');
        test.equals(this.parseStatement('a = obj.prop'), '$a = $obj->prop;');
        test.equals(this.parseStatement('a = obj.method()'), '$a = $obj->method();');
        test.equals(this.parseStatement('a = obj.prop.method()'), '$a = $obj->prop->method();');
        test.equals(this.parseStatement('a = obj.prop.method().prop2'), '$a = $obj->prop->method()->prop2;');
        test.done();
    },

    testAssignLVal: function (test) {
        test.equals(this.parseStatement('a[1] = 1'), '$a[1] = 1;');
        test.equals(this.parseStatement('b.a[1] = 1'), '$b->a[1] = 1;');
        test.equals(this.parseStatement('b.a[1].c = 1'), '$b->a[1]->c = 1;');
        test.equals(this.parseStatement('a[1].b = 1'), '$a[1]->b = 1;');
        test.equals(this.parseStatement('a.b[1].c = 1'), '$a->b[1]->c = 1;');
        test.equals(this.parseStatement('a[:foo] = 1'), '$a[\'foo\'] = 1;');
        test.equals(this.parseStatement('a["foo"] = 1'), '$a[\'foo\'] = 1;');
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

        test.equals(
            this.parseStatement('if obj.can_drink\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($obj->can_drink) {\necho(\'Beer Beer!\');\n} else if ($age < 6) {\necho(\'Milk\');\n} else {\necho(\'Juice\');\n}'
        );

        test.equals(
            this.parseStatement('if obj.can_drink()\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($obj->can_drink()) {\necho(\'Beer Beer!\');\n} else if ($age < 6) {\necho(\'Milk\');\n} else {\necho(\'Juice\');\n}'
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

    // For now arrays can only be expressions
    /*testArrayIdentifier: function (test) {
        test.equals(
            this.parseStatement('arr[1]'),
            '$arr[1];'
        );

        test.equals(
            this.parseStatement('arr[f(1)]'),
            '$arr[f(1)];'
        );

        test.equals(
            this.parseStatement('arr["an string"]'),
            '$arr[\'an string\'];'
        );

        test.equals(
            this.parseStatement('arr[:symbol]'),
            '$arr[\'symbol\'];'
        );

        test.done();
    },*/

    testClass: function (test) {
        test.equals(
            this.compileFile('./tests/blueberry/class1.bb'),
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
            this.compileFile('./tests/blueberry/switch1.bb'),
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
            this.parseStatement('a = var ?: 2'),
            '$a = $var ?: 2;'
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
            'for ($i = 0; $i <= 10; $i++) {\necho($i);\n}'
        );

        test.equals(
            this.parseStatement('for i in (10..0)\necho(i)\nend'),
            'for ($i = 10; $i >= 0; $i--) {\necho($i);\n}'
        );

        test.equals(
            this.parseStatement('for k: v in {"a": 1}\necho(k)\nend'),
            'foreach (array(\'a\' => 1) as $k => $v) {\necho($k);\n}'
        );

        test.done();
    },

    testJSON: function (test) {
        test.equals(
            this.parseStatement('a = { "name": "Mike", "meta": { "age": 18, "list": [1,2,3] } }'),
            '$a = array(\'name\' => \'Mike\', \'meta\' => array(\'age\' => 18, \'list\' => array(1, 2, 3)));'
        );

        test.done();
    },

    testArray: function (test) {
        test.equals(
            this.parseStatement('a = [1, "two", [f(x)]]'),
            '$a = array(1, \'two\', array(f($x)));'
        );

        // PHP doesn't support f()[1] so, let's leave it for now?
        //test.equals(
        //    this.parseStatement('a = f("somestr")[1]'),
        //    '$a = f(\'somestr\')[1];'
        //);

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
    },

    testAssignByReference: function (test) {
        test.equals(
            this.parseStatement('a &= b'),
            '$a &= $b;'
        );

        test.done();
    },

    testComments: function (test) {
        test.equals(
            this.parseStatement('# my comment'),
            '// my comment'
        );

        test.equals(
            this.parseStatement('/*\nmy comment\n*/'),
            '/*\nmy comment\n*/'
        );

        test.done();
    },

    testSymbol: function (test) {
        test.equals(
            this.parseStatement('a = :my_symbol'),
            '$a = \'my_symbol\';'
        );

        test.done();
    },

    testListComprehension: function (test) {
      test.equals(
          this.parseStatement('[2 * i for i in (1..10) where i % 2 == 0]'),
          'array_map(function($i){ return (2 * $i); }, array_filter(range(1, 10), function($i){ return ($i % 2) == 0; }));'
      );

      test.equals(
          this.parseStatement('[2 * i for i in (1..10)]'),
          'array_map(function($i){ return (2 * $i); }, range(1, 10));'
      );

      test.equals(
          this.parseStatement('a = [2 * i for i in (1..10) where i % 2 == 0]'),
          '$a = array_map(function($i){ return (2 * $i); }, array_filter(range(1, 10), function($i){ return ($i % 2) == 0; }));'
      );

      test.equals(
          this.parseStatement('a = {"a": [2*i for i in (1..3)]}'),
          "$a = array('a' => array_map(function($i){ return (2 * $i); }, range(1, 3)));"
      );

      test.done();
    },

    testClosures: function (test) {
      test.equals(
          this.parseStatement('a = (i) use (a) -> do return 2*i end'),
          "$a = function($i) use ($a) {\nreturn (2 * $i); \n};"
      );

      test.equals(
          this.parseStatement('a = (i) -> do return 2*i end'),
          "$a = function($i) {\nreturn (2 * $i); \n};"
      );

      test.equals(
          this.parseStatement('a = (i) -> 2*i'),
          "$a = function($i) { return (2 * $i); };"
      );

      test.equals(
          this.parseStatement('a = (i) use (a) -> 2*i'),
          "$a = function($i) use ($a) { return (2 * $i); };"
      );

      test.done();
    },

    testReturn: function (test) {
      test.equals(
          this.parseStatement('return 1'),
          'return 1;'
      );

      test.equals(
          this.parseStatement('return 2 * a'),
          'return (2 * $a);'
      );

      test.done();
    },

    testExamples: function (test) {
        var files = this.glob('examples/*.bb'),
            that = this;

        files.forEach(function (file) {
            var split = file.split('.'),
                errored = false,
                srcFile = file,
                outFile = split[0] + '.out.php',
                expFile = split[0] + '.expected.php';
            test.doesNotThrow(function () {
                try {
                    that.compileBlueberry(srcFile, outFile);
                } catch (err) {
                    console.log(
                        err.name + ' on line ' + err.line + ' column ' +
                        err.column + ' in ' + srcFile + '\nInvalid token ' + err.found
                    );
                    errored = true;
                    throw err;
                }
            });

            if (!errored) {
                var expectedSrc = that.load(expFile),
                    outSrc = that.load(outFile);
                test.equals(expectedSrc, outSrc);
                if (expectedSrc === outSrc) {
                    that.delete(outFile);
                }
            }
        });

        test.done();
    }
};

