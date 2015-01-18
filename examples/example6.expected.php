<?php
class MyClass {
    public $var1;

    public function a_public_method() {
        return 1;
    }

    protected function a_protected_method(&$byRef, $byVal) {
        print('HI!');
    }
}
