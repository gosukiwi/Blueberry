# IcedTea
IcedTea is a script language with clean syntax, inspired from CoffeeScript, 
Python and Ruby.

IcedTea compiles to __PHP__ so everything you do with IcedTea can run wherever
PHP can run, this is awesome for shared web servers where you can only run
default PHP.

Right now IcedTea is still in early development, but it's planned to implement
something very similar to CoffeeScript.

## Syntax Examples
These are some examples of all the things that are already working :)

### Classes

```
class Human
  @name
  @age = 18

  def greet
    echo(@name)
  end
end
```

### Functions

```
def myFunctionName(name)
  return "Hello" + name
end
```

### Conditionals

```
if age > 18 and age < 99
    doSomething()
else if age > 99 
    doSomethingElse()
else
    doNothing()
end
```

