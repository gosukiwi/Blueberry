<?php
while (($sometVar !== null)) {
    echo('Testing the while statement.');
}
foreach ($myArray as $key => $val) {
    echo('Key is ' . $key . ' and value is ' . $val);
}
for ($i = 0; $i <= 10; $i++) {
    echo($someArray[$i]);
}
foreach (array('a' => 1) as $k => $v) {
    echo($k . ' is ' . $v);
}
if ($a) {
    echo(1);
}
