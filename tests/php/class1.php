class Person {
  public $name;
  public $age = 18;

  public function SayHi () {
    echo($this->name);
  }
}

$mike = new Person();
$mike->SayHi();
echo($mike->age);
