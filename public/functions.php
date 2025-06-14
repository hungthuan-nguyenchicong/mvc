<?php

// Define your ROOT_PATH constant, typically in your application's entry point (e.g., index.php)
define('ROOT_PATH', __DIR__);
function root(): string {
    return ROOT_PATH . '/../';
}

function tt($t) {
    echo '<pre>';
    print_r($t);
    echo '</pre>';
}

?>