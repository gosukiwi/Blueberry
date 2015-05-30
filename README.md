# Blueberry
Blueberry is a script language with clean syntax, inspired from Ruby,
CoffeeScript, and Python.

Blueberry compiles to __PHP__ so everything you do with Blueberry can run
wherever PHP can run. This is particularly awesome for limited hosting services
where you have little to no control over the server.

Right now Blueberry is still in _very_ early development, it's usage is
encouraged only for testing purposes.

## Usage
Blueberry compiler runs on [Node](http://nodejs.org/). To compile Blueberry
files simply install the compiler like any other NPM module: `npm install
blueberry -g`. It's recommended to install it globally by using the `-g` option.

Once you have the compiler you can compile files by doing `bb compile in.bb
out.php`.

You can watch folders recursively as follows: `bb watch src/ build/`.

See the [wiki](https://github.com/gosukiwi/Blueberry/wiki) for extensive
documentation on the CLI (Command Line Interface).

## Syntax At A Glance

```
<?bb
/*
 I'm a multiline comment
*/

# variable definition
foo = 1
bar = "baz"
# constant definition uses all uppercase letters
PI  = 3.14

# You can use JSON syntax to define associative arrays
arr = { "name": "Mike", "age": 18, "meta": { "items": [1, 2, 3] } }

# Compiles to strict comparison `$a === 1`
if a == 1
  echo("Hello, World!")
end
# You can also use the inline syntax if it's only one statement
echo("Hello, World!") if a == 1
# Same for while and until
doSomething() until someConditionIsMet()

# Example for loop
for i in (0..10)
  echo(i)
end

# List comprehensions
myList = [2 * i for i in (1..10) where i % 2 == 0]
# It also works in JSON constructs
myArr  = { "first_names": [name.first_name for name in names] }

# Closures can be used as follows
foo = (arg1, arg2) -> return arg1 + arg2
bar = ->
  name = "Tolouse"
  return name
end
# Execute function
bar()

class MyClass < MyParentClass
  @name
  MY_CONST = "Hello" # access using self.MY_CONST

  def greet
    echo("Hello! My name is " & @name)
  end
end
?>
```

For more information, see the [wiki](https://github.com/gosukiwi/Blueberry/wiki).

## Contributing
Clone the repo, and install dependencies with `npm install --save-dev`.

Building the grammar, which you don't need to do unless you modify it, can be
done with `pegjs --cache src/grammar.g src/grammar.js`. You'll need to install
pegjs first, version 0.7 or later, e.g. `npm install -g pegjs`.

You can test out the command line usage by running `npm link`, that will enable
the `bb` command in your working directory.


## Versioning
Format: ```<major>.<minor>.<patch>```

Until beta, version numbers will stay low whenever possible. Once beta is
reached, semantic versioning will be usedm, meaning:

 * Breaking backwards compatibility bumps the major.
 * New additions without breaking backwards compatibility bumps the minor.
 * Bug fixes and misc changes bump the patch.
