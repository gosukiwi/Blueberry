class Person
  @name
  @age = 18

  def say_hi
    message = "Hello " & @name
    return message
  end
end

mike = new Person()
mike.SayHi()
echo(mike.age)
