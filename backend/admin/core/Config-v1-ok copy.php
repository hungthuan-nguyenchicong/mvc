<?php
namespace AdminCore;

// class Config {
//     private static $host = 'localhost';
//     private static $dbname = 'db';
//     private static $user = 'us';
//     private static $password = 'pw';

//     public function __construct() {
//         $this->getDbConfig();
//     }

//     /**
//      * Returns the database configuration array.
//      *
//      * @return array
//      */
    
//     public function getDbConfig(): array {
//         return [
//             'dsn' => "pgsql:host=" . self::$host . ";dbname=" . self::$dbname,
//             'user' => self::$user,
//             'password' => self::$password,
//         ];
//     }
// }

class Config {
    private $host = 'localhost';
    private $dbname = 'db';
    private $user = 'us';
    private $password = 'pw';

    public function __construct() {
        $this->getDbConfig();
    }

    /**
     * Returns the database configuration array.
     *
     * @return array
     */
    
    public function getDbConfig(): array {
        return [
            'dsn' => "pgsql:host=" . $this->host . ";dbname=" . $this->dbname,
            'user' => $this->user,
            'password' => $this->password,
        ];
    }
}