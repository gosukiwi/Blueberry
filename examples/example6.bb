<?bb
class MyClass
  @var1

  def a_public_method
    return 1
  end

protected

  def a_protected_method(&byRef, byVal)
    print("HI!")
  end
end
