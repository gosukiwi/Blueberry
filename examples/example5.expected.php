<?php
switch ($myVariable) {
case 'mike':
      echo('Hello, mike!');
    break;
case 'annie':
case 'tibbers':
      echo('I saw nothing');
    break;
default:
      echo('Hello!');
break;
}

try {
  $name = doSomething();
} catch (Exception $err) {
  echo($err->getMessage());
} finally {
  if (!$name) {
    $name = 'Mike';
  }
}
  
