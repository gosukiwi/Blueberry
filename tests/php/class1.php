class Person {
    public $name;
    public $age = 18;

    public function say_hi() {
        $message = 'Hello ' . $this->name;
        return $message;
    }
}
$mike = new Person();
$mike->SayHi();
echo($mike->age);
