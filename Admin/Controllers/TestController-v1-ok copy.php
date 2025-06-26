<?php

class TestController {
    private $testModel;

    public function __construct() {
        Model::admin('TestModel');
        $this->testModel = new TestModel();
    }

    public function testDatabase() {
        try {
            $this->testModel->testDatabase();
        } catch (Exception $e) {
            error_log('testDatabase failed: '.$e->getMessage());
            throw new Exception('testDatabase failed: '.$e->getMessage());
        }
    }
}

?>