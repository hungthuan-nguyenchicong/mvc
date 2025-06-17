<?php

class Database {
    private $pdo;
    private static $instance = null;

    /**
     * Private constructor to prevent direct instantiation.
     *
     * @param array $config The database configuration.
     */
    private function __construct(array $config) {
        try {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5, // Connection timeout in seconds
            ];

            $this->pdo = new PDO(
                $config['dsn'],
                $config['user'],
                $config['password'],
                $options
            );
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            // It's good to re-throw or throw a custom exception here
            // to allow the calling code to handle it gracefully.
            throw new Exception("Could not connect to the database.");
        }
    }

    /**
     * Get the single instance of the Database connection.
     *
     * @return Database
     * @throws Exception If the Config class or its method is not found, or configuration is invalid.
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            // Get the configuration using the static method from the Config class
            $config = Config::getDbConfig();

            // Basic validation for the config array
            if (!isset($config['dsn'], $config['user'], $config['password'])) {
                error_log('Invalid database configuration provided.');
                throw new Exception('Invalid database configuration.');
            }

            self::$instance = new Database($config);
        }
        return self::$instance;
    }

    /**
     * Get the PDO object for database operations.
     *
     * @return PDO
     * @throws Exception If the PDO object is null (connection failed).
     */
    public static function getPDO(): PDO {
        $instance = self::getInstance();
        if ($instance->pdo === null) {
            // This case should ideally be caught by the constructor's try-catch,
            // but it's a good defensive check.
            error_log('PDO object is null after instance creation attempt.');
            throw new Exception('Database connection not established.');
        }
        return $instance->pdo;
    }
}


?>