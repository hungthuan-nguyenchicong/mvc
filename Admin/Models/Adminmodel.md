## sql

<?php

class AdminModel {
    private PDO $db; // Assuming you pass a PDO connection object to the constructor

    public function __construct(PDO $db_connection) {
        $this->db = $db_connection;
    }

    public function validateLogin(string $username, string $password): bool {
        // 1. Prepare SQL statement to fetch user by username.
        //    Using Prepared Statements is crucial to prevent SQL Injection.
        $stmt = $this->db->prepare("SELECT password FROM admins WHERE username = :username LIMIT 1");
        
        // 2. Bind the username parameter.
        $stmt->bindParam(':username', $username);
        
        // 3. Execute the statement.
        $stmt->execute();
        
        // 4. Fetch the user's data (specifically the hashed password).
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        // 5. Check if a user was found AND verify the password.
        if ($admin && password_verify($password, $admin['password'])) {
            return true; // Login successful
        }

        return false; // Login failed
    }

    // You would also have methods to create new admins, update passwords, etc.
    // Example for creating a new admin (conceptual)
    public function createAdmin(string $username, string $password): bool {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO admins (username, password) VALUES (:username, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $hashedPassword);
        return $stmt->execute();
    }
}

?>