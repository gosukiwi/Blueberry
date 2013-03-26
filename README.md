# Iced Tea
Iced Tea is a script language with clean syntax, inspired from CoffeeScript, 
Python and Ruby.

Iced Tea compiles to __PHP__ so everything you do with Iced Tea can run wherever
PHP can run, this is awesome for shared web servers where you can only run
default PHP.

Right now Iced Tea is still in early development, but it's planned to implement
something very similar to CoffeeScript.

## Command Line Usage

The easiest way to compile Iced Tea code into PHP code is using the 
```tea``` file, inside the ```bin``` directory. 

```bin/tea compile file.tea```

If using unix you can just symlink the executable to your ```/bin``` folder, 
if windows, add the path to ```tea.bat``` to your PATH env variable.

See the [wiki](https://github.com/gosukiwi/IcedTea/wiki) for extensive documentation on the CLI (Command Line Interface)

## Syntax Examples

Here's an example of the overall syntax of Iced Tea

```
a = 1 # variable definition

# you can use JSON syntax to define associative arrays
arr = { 'name': 'Mike', 'age': 18, 'meta': { 'items': [1, 2, 3] } }

if a == 1
  echo('Hello, World!')
end

for(i in (0..10))
  echo(i)
end

class MyClass < MyParentClass
  @name

  def Greet
    echo('Hello! My name is ' & @name)
  end
end
```

For more information, see the [wiki](https://github.com/gosukiwi/IcedTea/wiki).

