class Person {
  public $name;
  public $age = 18;
  function SayHi () {
    echo($this->name);
  }

}


$mike = new Person();
$mike->SayHi();
echo($mike->age);
