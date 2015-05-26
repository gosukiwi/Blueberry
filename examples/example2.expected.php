<?php
class Animal {
    public $name;
    public $age = 18;

    public function __construct($name) {
        $this->name = $name;
    }

    public function greet() {
        echo('Hello! I\'m ' . $this->name);
    }
}
$human = new Animal();
$human->greet();
echo($human->name);
