<?php
namespace AdminApp\Models;

use AdminCore\Config;
use PDO;
use PDOException;

class Model {
    protected $config;
    // 1. Change $pdo to a static property to hold the single connection instance
    protected static $pdoInstance = null; 

    // We no longer need the instance property $pdo
    // protected $pdo; 

    protected function __construct() {
        $this->config = new Config();
        
        // 2. We now call connectDatabase() if a connection hasn't been established yet
        $this->connectDatabase();
    }

    private function connectDatabase() {
        // 3. Implement the Singleton pattern: Check if $pdoInstance is already set
        if (self::$pdoInstance !== null) {
            // Connection already exists, do nothing and return.
            return;
        }

        // 4. If connection is null, proceed with creating it

        // Retrieve configuration data
        $dbConfig = $this->config->getDbConfig();

        $dbHost = $dbConfig['dbhost'] ?? null;
        $dbName = $dbConfig['dbname'] ?? null;
        $dbUser = $dbConfig['dbuser'] ?? null;
        $dbPass = $dbConfig['dbpassword'] ?? null;

        if (!$dbHost || !$dbName || !$dbUser) {
            error_log("Missing database environment variables.");
            http_response_code(500);
            die("Lỗi cấu hình hệ thống: Thiếu thông tin kết nối cơ sở dữ liệu.");
        }

        $dsn = "pgsql:host=$dbHost;dbname=$dbName";

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            // 5. Create the PDO connection and assign it to the static property
            self::$pdoInstance = new PDO($dsn, $dbUser, $dbPass, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            die("Lỗi hệ thống nội bộ: Không thể kết nối cơ sở dữ liệu.");
        }
    }
    
    /**
     * Get the PDO connection instance.
     * * @return PDO
     */
    protected function getPdo(): PDO {
        // Since connectDatabase() is called in the constructor, we guarantee $pdoInstance is set.
        return self::$pdoInstance;
    }

    // Example usage in a child Model class method:
    // public function getUserById($id) {
    //     $stmt = $this->getPdo()->prepare("SELECT * FROM users WHERE id = :id");
    //     $stmt->execute(['id' => $id]);
    //     return $stmt->fetch();
    // }
}