<?php
namespace AdminApp\Models;

/*
CREATE TABLE users (
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
*/

class AdminModel extends Model {
    //private static $username = 'admin';
    //echo password_hash('admin passw', PASSWORD_DEFAULT);
    //private static $passwordHash = '$2y$10$pKgnRonxAf5WcyIAOCRyce0hNXKc/aMfudLjdTzvV4EGwUXc1Xyhu';

    public function __construct() {
        parent::__construct();
    }

    // private function getPasswordHash(string $username): ?string {
    //     try {
    //         $sql = "SELECT password_hash FROM users WHERE username = :username LIMIT 1";
    //         $stmt = $this->getPdo()->prepare($sql);
    //         $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    //         $stmt->execute();
    //         $result = $stmt->fetch(FETCH_ASSOC);
    //         return $result['password_hash'] ?? null;
    //     } catch (PDOException $e) {
    //         error_log($e->getMessage());
    //         throw $e;
    //     }
    // }

    private function getPasswordHash(string $username): ?string {
        try {
            $sql = "SELECT password_hash FROM users WHERE username = :username LIMIT 1";
            $stmt = $this->getPdo()->prepare($sql);
            // Correct reference to global constant \PDO::PARAM_STR
            $stmt->bindParam(':username', $username, \PDO::PARAM_STR);
            $stmt->execute();
            // Correct reference to global constant \PDO::FETCH_ASSOC
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $result['password_hash'] ?? null;
        // Correct reference to global class \PDOException
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            throw $e;
        }
    }

    // private static function passwordVerify(string $password): bool {
    //     return password_verify($password, self::$passwordHash);
    // }

    private function passwordVerify(string $username, string $password): bool {
        try {
            $hash = $this->getPasswordHash($username);
            return password_verify($password, $hash);
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception($e->getMessage());
        }
        
    }

    // public function validateLogin(string $username, string $password): bool {
    //     if ($username === self::$username && self::passwordVerify($password) === true) {
    //         return true;
    //     }
    //     return false;
    // }

    public function validateLogin(string $username, string $password): bool {
        try {
            if ($this->passwordVerify($username, $password)) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
}