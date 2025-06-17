<?php
class Config {
    private static $host = 'localhost';
    private static $dbname = 'mvcdb';
    private static $user = 'cong';
    private static $password = 'Cong12345';

    /**
     * Returns the database configuration array.
     *
     * @return array
     */
    public static function getDbConfig(): array {
        return [
            'dsn' => "pgsql:host=" . self::$host . ";dbname=" . self::$dbname,
            'user' => self::$user,
            'password' => self::$password,
        ];
    }
}

?>