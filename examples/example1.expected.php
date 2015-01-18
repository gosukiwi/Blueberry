<?php
if ($a) {
    echo('Hello "World"!');
    $a = (2 + 3.14);
} else if ($c !== null) {
    $c = 1;
} else {
    echo('WTF');
}
callSomething();
$can_drink = ((($age > 18 && $name !== 'McLovin')) || $b);
