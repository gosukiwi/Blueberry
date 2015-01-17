class SomeClass
  @id
  self.counter = 2

  def self.a
    self.counter = 3
    self.static_method()
  end

protected

  def b
  end

private 

  @name

  def c
    return 3
  end
end
