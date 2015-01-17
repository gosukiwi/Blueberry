class SomeClass {
  public $id;
  public static $counter = 2

  public static function a() {
    SomeClass::$counter = 3
    SomeClass::static_method()
  }

  protected function b() {
  }

  private $name;

  private function c() {
    return 3;
  }
}
