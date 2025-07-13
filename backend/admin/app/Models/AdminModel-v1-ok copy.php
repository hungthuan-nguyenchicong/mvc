<?php
namespace AdminApp\Models;

class AdminModel extends Model {
    private static $username = 'admin';
    //echo password_hash('admin passw', PASSWORD_DEFAULT);
    private static $passwordHash = '$2y$10$pKgnRonxAf5WcyIAOCRyce0hNXKc/aMfudLjdTzvV4EGwUXc1Xyhu';

    public function __construct() {
        parent::__construct();
    }

    private static function passwordVerify(string $password): bool {
        return password_verify($password, self::$passwordHash);
    }

    public function validateLogin(string $username, string $password): bool {
        if ($username === self::$username && self::passwordVerify($password) === true) {
            return true;
        }
        return false;
    }
}