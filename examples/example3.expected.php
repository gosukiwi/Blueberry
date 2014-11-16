<?php
while (($sometVar != null)) {
    echo('Testing the while statement.');
}

foreach ($myArray as $key, $val) {
    echo('Key is ' . $key . ' and value is ' . $val);
}

foreach (range(0, 10) as $i) {
    echo($someArray[$i]);
}

foreach (array('a' => 1) as $k, $v) {
  echo($k . ' is ' . $v);
}

