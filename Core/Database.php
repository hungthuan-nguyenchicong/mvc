<?php

class Database {
    private $pdo;
    private static $instance = null;

    private function __construct($config) {
        try {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5,
            ];

            $this->pdo = new PDO(
                $config['dsn'],
                $config['user'],
                $config['password'],
                $options
            );
        } catch (PDOException $e) {
            error_log('Database connection failed: '.$e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    private static function getInstance($config = null) {
        if (self::$instance === null) {
            if ($config === null) {
                $configFile = root(). 'Core/Config.php';
                if (is_file($configFile)) {
                    $config = require_once $configFile;
                } else {
                    error_log('Config file not found: '. $configFile);
                    throw new Exception('Config file not found:');
                }
            }
            self::$instance = new Database($config);
        }
        return self::$instance;
    }

    public static function getPDO() {
        $instance = self::getInstance();
        if ($instance === null || $instance->pdo === null) {
            error_log('PDO object is null');
            throw new Exception('PDO object is null');
        }
        return $instance->pdo;
    }
}

?>