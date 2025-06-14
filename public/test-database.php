<?php

require_once root(). 'Admin/Controllers/TestController.php';
$testController = new TestController();
$testController->testDatabase();

?>