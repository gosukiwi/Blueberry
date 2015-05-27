'use strict';

module.exports = {
    setUp: function (callback) {
        var parser = require('../src/grammar.js'),
            scope  = require('../src/state.js'),
            src = require('../src/blueberry.js'),
            fs = require('fs'),
            glob = require('glob');

        this.scope = scope,

        this.compile = function (source) {
            return parser.parse(source);
        };

        var statementParser = require('../src/parsers/statement.js');
        this.parseStatement = function (source, plain) {
            if(plain === undefined) {
              plain = true;
            }

            var result = statementParser(this.compile(source)[0]);

            if(plain === true) {
              result = this.plainCode(result);
            }

            return result;
        };

        this.load = function (name, plain) {
            var result = this.unixNewlines(fs.readFileSync(name, 'utf8'));
            if(plain === true) {
              result = this.plainCode(result);
            }
            return result;
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

        this.compileFile = function(name, plain) {
            var source = fs.readFileSync(name, 'utf8');
            var ast = this.compile(source);
            var output = '';

            for(var i = 0; i < ast.length; i++) {
                output += statementParser(ast[i]);
            }

            var result = this.unixNewlines(output);

            if(plain === true) {
              result = this.plainCode(result);
            }

            return result;
        };

        // Manually clear the scope
        this.clearScope = function () {
          this.scope.clear();
        };

        // When blueberry code gets compiled and we want to compare it, we don't
        // care much about the indentation, so let's get rid of it. This outputs
        // code in a simple format, no new lines and always 1 space separation.
        this.plainCode = function (code) {
          code = code.replace(/\s+/g, ' ');
          code = code.replace(/\n+/g, '');
          return code.trim();
        }

        this.compileBlueberry = src.compileFile;
        this.glob = glob.sync;

        callback();
    },

    tearDown: function (callback) {
        // clean up
        this.clearScope();
        callback();
    },

    testPrimitives: function (test) {
        test.equals(this.parseStatement('a = 1'), '$a = 1;');
        test.equals(this.parseStatement('a = 1.5'), '$a = 1.5;');
        test.equals(this.parseStatement('a = "asd"'), '$a = \'asd\';');
        test.equals(this.parseStatement('a = "this has a\nnewline"', false), '$a = \'this has a\nnewline\';\n');
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
        test.equals(this.parseStatement('obj = new Foo()'), '$obj = new Foo();');
        test.equals(this.parseStatement('a = obj.prop'), '$a = $obj->prop;');
        test.equals(this.parseStatement('a = obj.method()'), '$a = $obj->method();');
        test.equals(this.parseStatement('a = obj.prop.method()'), '$a = $obj->prop->method();');
        test.equals(this.parseStatement('a = obj.prop.method().prop2'), '$a = $obj->prop->method()->prop2;');
        test.done();
    },

    testCompare: function (test) {
        test.equals(this.parseStatement('a = 1 == 2'), '$a = 1 === 2;');
        test.equals(this.parseStatement('a = 1 != 2'), '$a = 1 !== 2;');
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
        this.parseStatement('obj = new Foo()');
        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nend'),
            'if ($can_drink) { echo(\'Beer Beer!\'); }'
        );

        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nelse\necho("Juice")\nend'),
            'if ($can_drink) { echo(\'Beer Beer!\'); } else { echo(\'Juice\'); }'
        );

        test.equals(
            this.parseStatement('if can_drink\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($can_drink) { echo(\'Beer Beer!\'); } else if ($age < 6) { echo(\'Milk\'); } else { echo(\'Juice\'); }'
        );

        test.equals(
            this.parseStatement('if obj.can_drink\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($obj->can_drink) { echo(\'Beer Beer!\'); } else if ($age < 6) { echo(\'Milk\'); } else { echo(\'Juice\'); }'
        );

        test.equals(
            this.parseStatement('if obj.can_drink()\necho("Beer Beer!")\nelse if age < 6\necho("Milk")\nelse\necho("Juice")\nend'),
            'if ($obj->can_drink()) { echo(\'Beer Beer!\'); } else if ($age < 6) { echo(\'Milk\'); } else { echo(\'Juice\'); }'
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
            'while ($a) { $b = 1; }'
        );

        test.equals(
            this.parseStatement('while age > 18\nb = 1\nend'),
            'while ($age > 18) { $b = 1; }'
        );

        test.done();
    },

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
            this.compileFile('./tests/blueberry/switch1.bb', true),
            this.load('./tests/php/switch1.php', true)
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
            'if (!$age > 18) { cannotDrink(); }'
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
            'for ($i = 0; $i <= 10; $i++) { echo($i); }'
        );

        test.equals(
            this.parseStatement('for i in (10..0)\necho(i)\nend'),
            'for ($i = 10; $i >= 0; $i--) { echo($i); }'
        );

        test.equals(
            this.parseStatement('for k: v in {"a": 1}\necho(k)\nend'),
            'foreach (array(\'a\' => 1) as $k => $v) { echo($k); }'
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
            'try { $a = 1; } catch (Exception $error) { $b = 2; } finally { $c = 3; }'
        );

        test.equals(
            this.parseStatement('try\na=1\ncatch\nb=2\nfinally\nc=3\nend'),
            'try { $a = 1; } catch (Exception $ex) { $b = 2; } finally { $c = 3; }'
        );

        test.equals(
            this.parseStatement('try\na=1\ncatch\nb=2\nend'),
            'try { $a = 1; } catch (Exception $ex) { $b = 2; }'
        );

        test.done();
    },

    testClassAcessModifier: function (test) {
        test.equals(
            this.parseStatement('class MyClass\nprivate\n@var1\n@var2 = 1\nend'),
            'class MyClass { private $var1; private $var2 = 1; }'
        );

        test.equals(
            this.parseStatement('class MyClass\nprivate\n@var1\ndef foo\na = 1\nend\nend'),
            'class MyClass { private $var1; private function foo() { $a = 1; } }'
        );

        test.done();
    },

    testStaticClasses: function (test) {
        var result = this.parseStatement(
            "class A\n"
          + "  self.counter = 2\n"
          + "  @name\n"
          + "  def a\n"
          + "    return self.static_attr.someChain\n"
          + "  end\n"
          + "  def self.b\n"
          + "    foo = new Bar()\n"
          + "    foo.test()\n"
          + "    Baz.test()\n"
          + "  end\n"
          + "private\n"
          + "  def c(foo)\n"
          + "    foo.bar()"
          + "  end\n"
          + "end\n"
        );

        test.equals(result, 'class A { '
          + 'public static $counter = 2; public $name; '
          + 'public function a() { return self::static_attr->someChain; } '
          + 'public static function b() { $foo = new Bar(); $foo->test(); Baz::test(); } '
          + 'private function c($foo) { $foo->bar(); } }');

        test.equals(this.parseStatement("A.b()"), 'A::b();');

        this.parseStatement("obj = new A()");
        test.equals(this.parseStatement("obj.a()"), '$obj->a();');

        test.done();
    },

    testClassInheritance: function (test) {
        test.equals(
            this.parseStatement('class A < B\nend'),
            'class A extends B { }'
        );

        test.done();
    },

    testIdentifierByReference: function (test) {
        test.equals(
            this.parseStatement('def myFunc (&var, var2)\nend'),
            'function myFunc(&$var, $var2) { }'
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
            ''
        );

        test.equals(
            this.parseStatement('/*\nmy comment\n*/', false),
            ''
        );

        test.done();
    },

    testCommentsEverywhere: function (test) {
      test.equals(
        this.parseStatement("if a#hi\nb = 2 /*another comment*/\nend #comment here too"),
        'if ($a) { $b = 2; }'
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
          'array_map(function($i){ return (2 * $i); }, array_filter(range(1, 10), function($i){ return ($i % 2) === 0; }));'
      );

      test.equals(
          this.parseStatement('[2 * i for i in (1..10)]'),
          'array_map(function($i){ return (2 * $i); }, range(1, 10));'
      );

      test.equals(
          this.parseStatement('a = [2 * i for i in (1..10) where i % 2 == 0]'),
          '$a = array_map(function($i){ return (2 * $i); }, array_filter(range(1, 10), function($i){ return ($i % 2) === 0; }));'
      );

      test.equals(
          this.parseStatement('a = {"a": [2*i for i in (1..3)]}'),
          "$a = array('a' => array_map(function($i){ return (2 * $i); }, range(1, 3)));"
      );

      test.done();
    },

    testClosures: function (test) {
      test.equals(
          this.parseStatement('a = () use (i) -> return 2*i end'),
          "$a = function() use ($i) { return (2 * $i); };"
      );

      this.clearScope();
      test.equals(
          this.parseStatement('a = () -> return 2*i end'),
          "$a = function() { return (2 * $i); };"
      );

      test.equals(
          this.parseStatement('a = (i) use (b) -> return 2*i end'),
          "$a = function($i) use ($b) { return (2 * $i); };"
      );

      this.clearScope();
      test.equals(
          this.parseStatement('a = (i) -> return 2*i end'),
          "$a = function($i) { return (2 * $i); };"
      );

      this.clearScope();
      test.equals(
          this.parseStatement('a = (i) -> 2*i'),
          "$a = function($i) { return (2 * $i); };"
      );

      test.equals(
          this.parseStatement('a = (i) use (a) -> 2*i'),
          "$a = function($i) use ($a) { return (2 * $i); };"
      );

      test.equals(
          this.parseStatement('some_func((i) use (a) -> 2*i, "another_arg")'),
          "some_func(function($i) use ($a) { return (2 * $i); }, 'another_arg');"
      );

      test.done();
    },

    testClosuresShort: function (test) {
      test.equals(
          this.parseStatement('z = -> return "Hello, World!" end'),
          "$z = function() { return 'Hello, World!'; };"
      );

      this.clearScope();
      test.equals(
          this.parseStatement('z = -> "Hello, World!"'),
          "$z = function() { return 'Hello, World!'; };"
      );

      this.clearScope();
      test.equals(
          this.parseStatement('z = -> a = "Hello, World!"'),
          "$z = function() { return $a = 'Hello, World!'; };"
      );

      test.done();
    },

    testImplicitScope: function (test) {
      this.parseStatement('a = 1');
      test.equals(
          this.parseStatement('f = (i) -> 2*a'),
          "$f = function($i) use ($a) { return (2 * $a); };"
      );

      // Now that a is not on the parent scope, it's not USEd automatically
      this.clearScope();
      test.equals(
          this.parseStatement('f = (i) -> 2*a'),
          "$f = function($i) { return (2 * $a); };"
      );

      this.clearScope();
      this.parseStatement('a = 3');
      test.equals(
          this.parseStatement('b = (i) -> (j) -> i + j + a'),
          '$b = function($i) use ($a) { return function($j) use ($i, $a) { return ($i + ($j + $a)); }; };'
      );

      test.done();
    },

    testVariableFunctions: function(test) {
      // Set up a variable
      this.parseStatement('api = () -> 2*2');

      // Because it's now defined, it should now call it
      test.equals(
          this.parseStatement('api(1, 2, 3)'),
          '$api(1, 2, 3);'
      );

      // b is not defined, so it assumes function name
      test.equals(
          this.parseStatement('b(1, 2, 3)'),
          'b(1, 2, 3);'
      );

      // Now inside a function
      test.equals(
          this.parseStatement("def f\nc = 1\nc()\nend"),
          "function f() { $c = 1; $c(); }"
      );

      // Inside function arguments
      test.equals(
          this.parseStatement("def f(c)\nc()\nend"),
          "function f($c) { $c(); }"
      );

      // Inside closure arguments
      this.clearScope();
      test.equals(
          this.parseStatement("a = (c) -> c()"),
          '$a = function($c) { return $c(); };'
      );

      // Inside closure's use
      test.equals(
          this.parseStatement("a = (c) use (b) -> b()"),
          '$a = function($c) use ($b) { return $b(); };'
      );

      test.equals(
          this.parseStatement("a = (c) use (b) -> d()"),
          '$a = function($c) use ($b) { return d(); };'
      );

      // Test nesting
      test.equals(
          this.parseStatement("def a\ndef b\nc=1\nc()\nend\nend"),
          'function a() { function b() { $c = 1; $c(); } }'
      );

      test.equals(
          this.parseStatement("def a\ndef b\nc=1\nd()\nend\nend"),
          'function a() { function b() { $c = 1; d(); } }'
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
    },
};
