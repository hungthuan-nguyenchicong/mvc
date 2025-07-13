<?php
namespace AdminCore;

class Config {
    private static $host = 'localhost';
    private static $dbname = 'namedb';
    private static $user = 'user';
    private static $password = 'pass';

    
    /**
     * Returns the database configuration array.
     *
     * @return array
     */
    
    public function getDbConfig(): array {
        return [
            'dbhost' => self::$host,
            'dbname' => self::$dbname,
            'dbuser' => self::$user,
            'dbpassword' => self::$password,
        ];
    }
}
