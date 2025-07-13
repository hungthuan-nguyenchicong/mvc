<?php
namespace AdminApp\Models;

class TestModel extends Model {
    public function __construct() {
        parent::__construct();
    }

    public function testDatabase() {
        try {
            $sql = "SELECT 'Hello, database'";
            $stmt = $this->getPdo()->prepare($sql);
            $stmt->execute();
            // $stmt->fetch(PDO::FETCH_ASSOC);
            // print_r($stmt);
            // Correctly fetch and store the result
            $result = $stmt->fetchColumn(); // No need for PDO::FETCH_ASSOC with fetchColumn()

            // Echo the actual result
            echo "<br>Database Test Result: " . $result;
        } catch (PDOException $e) {
            error_log('testDatabase failed: '.$e->getMessage());
            throw new Exception ('testDatabase failed: '.$e->getMessage());
        }
    }
}