# IcedTea
IcedTea is a script language with clean syntax, inspired from CoffeeScript, 
Python and Ruby.

IcedTea compiles to __PHP__ so everything you do with IcedTea can run wherever
PHP can run, this is awesome for shared web servers where you can only run
default PHP.

Right now IcedTea is still in early development, but it's planned to implement
something very similar to CoffeeScript.

## Command Line Usage

The easiest way to compile Iced Tea code into PHP code is using the 
```tea``` file, inside the ```bin``` directory. 

```bin/tea compile file.tea```

If using unix you can just symlink the executable to your ```/bin``` folder, 
if windows, add the path to ```tea.bat``` to your PATH env variable.

See the wiki for extensive documentation on the CLI (Command Line Interface)

## Syntax Examples

These are some examples of all the things that are already working :)

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

You can also use ```switch```

```
switch someVariable
  when "mike"
    echo('Hello, Mike!')
  when "john"
    echo('Hello, John!')
  when "annie", "marceline"
    echo('Hai gals')
  else
    echo('Hello, World!')
end
```

### Boolean Not

To apply a boolean not operation, use the ```not``` keyword

```
if not (age > 18)
    doSomething()
end

myValue = not myVariable
```

### Ternary Operator

```
title = age > 18 ? 'Mister' : 'Boy'
```

### Default Value

```
name = getName() ?? 'Mike'
```

If ```getName()``` is falsy, 'Mike' will be used, that translates as

```
name = getName() ? getName () : 'Mike'
```

### Loops

IcedTea has several loop flavours, ```while``` and ```for``` beeing the most
common ones.

```
while someFunctionReturnsTrue()
    echo('Hello, World!')
end

# The for is very similar to ruby's :)
for i in (0..10)
    echo(i)
end
```

Ranges generate an array from start to end, so you can also do

```
myArr = (0..returnsInteger())
```

You can of course call for with any collection

```
myData = array(1, 2, 3, 4)
for i in myData
    echo(i)
end
```

### Concatenation

The concatenation operator is ```&```.

```
echo('Hello ' & name)
```

### Arrays

You can create arrays with ```[]```
Also, arrays can have initial values

```
myArray = [1, 2, f(1)]

callSomething([1, 2])

emptyArray = []
```

To get the array item at a given index is the same as PHP

```
item = arr[2]
```

Arrays indeces start from 0

### Multidimensional Arrays Using JSON Sytnax

You can create multidimensional arrays using JSON syntax

```
myArray = {
    'name': 'John',
    'age': getAge(),
    'more_data': {
        'married': false
    }
}
```

### Try-Catch

```
try
  someCodeHere()
catch myError
  echo(myError.getMessage())
finally
  doSomethingElse()
end
```

Of course you can omit the ```finally``` and the catch argument

```
try
  someCodeHere()
catch
  # When you don't include an argument identifier, "ex" is used
  # Nevertheless, most of the time you don't include one it's because you wont
  # use it.
  echo(ex.getMessage())
end
```

### Functions

Functions are created using the ```def``` keyword

```
def myFunctionName(name)
  return "Hello" & name
end
```

### Classes

Classes include the ```@``` operator from Ruby, using that operator you can
create instance variables and later on refer to them in a very simple and
readable way.

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
    echo("Hi! I'm " & @name)
  end
end

mike = new Human()
mike.greet()
echo('Mike is ' & mike.age & ' years old.')
```


