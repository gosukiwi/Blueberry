<?php
class MyClass {
  private $var1;
  protected $var2 = 2;
  public $var3;
  protected function MyMethod (&$byRef, $byVal) {
    echo('HI!');
  }
}
?>
