<?php
namespace AdminCore;

// Thêm dòng này để import lớp Dotenv\Dotenv
use Dotenv\Dotenv;

class ENV {
    public function __construct() {
        // Bây giờ bạn có thể gọi trực tiếp Dotenv::createImmutable()
        $envFile = root();
        $dotenv = Dotenv::createImmutable($envFile);
        $dotenv->load();

        //echo "DB Host: " . $_ENV['DB_HOST'] . PHP_EOL;
    }
}
