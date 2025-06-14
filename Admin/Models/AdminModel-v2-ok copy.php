<?php
/*
CREATE TABLE users (
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
*/
class AdminModel {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getPDO();
    }

    private function getPasswordHash(string $username): ?string {
        try {
            $sql = "SELECT password_hash FROM users WHERE username = :username LIMIT 1";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['password_hash'] ?? null;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    private function passwordVerify(string $password, string $hashedPassword):bool {
        return password_verify($password, $hashedPassword);
    }

    public function validateLogin(string $username, string $password): bool {
        try {
            $hashedPassword = $this->getPasswordHash($username);
            if ($hashedPassword === null) {
                return false;
            }

            // Only attempt to verify the password if a hash was successfully retrieved.
            if ($this->passwordVerify($password, $hashedPassword)) {
                return true; // Login successful
            } else {
                return false; // Password does not match
            }
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
}

?>