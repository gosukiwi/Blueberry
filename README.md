# Blueberry
Blueberry is a script language with clean syntax, inspired from CoffeeScript, 
Python and Ruby.

Blueberry compiles to __PHP__ so everything you do with Blueberry can run wherever
PHP can run, this is awesome for shared web servers where you can only run
default PHP.

Right now Blueberry is still in very early development, it's usage is encouraged
mostly for testing purposes.

## Building

All the compiler dependencies can be installed with `npm install`.

Building the grammar, which you don't need to do unless you modify it, can be done with `pegjs --cache src/grammar.g src/grammar.js`. You'll need to install pegjs first, version 0.7 or later, e.g. `npm install -g pegjs`.

## Command Line Usage

The easiest way to compile Blueberry code into PHP code is using the 
```bb``` file, inside the ```bin``` directory. 

```bin/bb compile file.bb```

If using unix you can just symlink the executable to your ```/bin``` folder, 
if windows, add the path to ```bb.bat``` to your PATH env variable.

See the [wiki](https://github.com/gosukiwi/Blueberry/wiki) for extensive documentation on the CLI (Command Line Interface)

## Syntax At A Glance

```
<?bb
/* 
 I'm a multiline comment
*/

a = 1 # variable definition

# you can use JSON syntax to define associative arrays
arr = { "name": "Mike", "age": 18, "meta": { "items": [1, 2, 3] } }

# strict comparison, like PHP's ===
if a == 1
  echo("Hello, World!")
end

# inclusive range, 0 <= i <= 10
for i in (0..10)
  echo(i)
end

class MyClass < MyParentClass
  @name

  def Greet
    echo("Hello! My name is " & @name)
  end
end
?>
```

For more information, see the [wiki](https://github.com/gosukiwi/Blueberry/wiki).

# Versioning
Format: ```<major>.<minor>.<patch>```

Breaking backwards compatibility bumps the major

New additions without breaking backwards compatibility bumps the minor

Bug fixes and misc changes bump the patch
