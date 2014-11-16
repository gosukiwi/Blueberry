<?php
/*
* Tea class example :)
*/

class MyClass {
  private $var1;
  protected $var2 = 2;
  public $var3;

  // protected method definition
  protected function MyMethod (&$byRef, $byVal) {
    echo('HI!');
  }
}
