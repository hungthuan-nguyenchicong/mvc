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
            throw $e;
        }
    }

    /**
     * Verifies the provided password against the stored hash for a given username.
     * Includes timing attack mitigation: password_verify is always called,
     * even for non-existent users, using a dummy hash.
     *
     * @param string $username The username to verify.
     * @param string $password The password to verify.
     * @return bool True if the password matches, false otherwise.
     * @throws Exception If an unexpected error occurs during verification.
     */
    private function passwordVerify(string $username, string $password): bool {
        try {
            $hash = $this->getPasswordHash($username);

            // Important: This dummy hash must never be a real user's password hash.
            // It's used to ensure password_verify is always called,
            // even if the username doesn't exist, preventing timing attacks.
            $dummyHash = '$2y$10$abcdefghijklmnopqrstuvwxyza.abcdefghijklmnopqrstuvwx'; // Example dummy hash, constant length

            // If no hash is found for the username, use the dummy hash.
            // Otherwise, use the actual hash retrieved from the database.
            $hashToVerify = $hash ?? $dummyHash;

            // Always call password_verify. This is crucial for timing attack prevention.
            return password_verify($password, $hashToVerify);

        } catch (Exception $e) {
            // Log the exception, and re-throw a more generic one if you don't want to expose internal details.
            error_log($e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

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

    // nếu cần lấy dữ liệu
    // public function validateLogin(string $username, string $password): ?array { // Or a User object
    //     try {
    //         if ($this->passwordVerify($username, $password)) {
    //             // Fetch basic user details if needed for session
    //             $sql = "SELECT username FROM users WHERE username = :username LIMIT 1";
    //             $stmt = $this->pdo->prepare($sql);
    //             $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    //             $stmt->execute();
    //             return $stmt->fetch(PDO::FETCH_ASSOC); // Returns ['username' => 'value'] or null
    //         }
    //         return null;
    //     } catch (Exception $e) {
    //         error_log($e->getMessage());
    //         throw new Exception($e->getMessage());
    //     }
    // }

}

?>