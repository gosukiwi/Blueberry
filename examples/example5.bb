<?tea
switch myVariable
    when "mike"
      echo('Hello, mike!')
    when "annie", "tibbers"
      echo('I saw nothing')
    else
      echo('Hello!')
end

try 
  name = doSomething()
catch err
  echo(err.getMessage())
finally
  if not name
    name = "Mike"
  end
end
  
