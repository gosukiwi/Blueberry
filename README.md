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
  # name will be a public instance variable
  @name
  # age will also be a public instance variable with a value of 18
  @age = 18

  def __construct(name)
    # this is the class' constructor
    @name = name
  end

  def greet
    echo(@name)
  end
end

mike = new Human()
mike.greet()
echo(mike.age)
```

### Functions

```
def myFunctionName(name)
  return "Hello" & name
end
```

### Loops

```
while someFunctionReturnsTrue()
    echo('Hello, World!')
end
``` 

### Conditionals

Boolean operations must be enclosed with ```()```

```
if (age > 18) and (age < 99)
    doSomething()
else if (age > 99)
    doSomethingElse()
else
    doNothing()
end
```

