<?php
namespace AdminApp\Models;

use AdminCore\Config;
use PDO;
use PDOException;

class Model {
    protected $config;
    protected $pdo; // Đối tượng kết nối PDO

    // Chúng ta không cần thuộc tính $env vì chúng ta sử dụng $_ENV
    // protected $env; 

    protected function __construct() {
        // Tải biến môi trường
        //$this->getEnv();
        $this->config = new Config();
        //print_r($this->config->getDbConfig());
        // Thiết lập kết nối cơ sở dữ liệu ngay khi khởi tạo Model
        //$this->config->getDbConfig();

        $this->connectDatabase();
    }

    // private function getEnv() {
    //     // Lưu ý: Tôi giả sử `root()` là một hàm helper đã được định nghĩa ở nơi khác
    //     // để trả về đường dẫn thư mục gốc của dự án chứa file .env.
    //     $envFile = root();
    //     $dotenv = Dotenv::createImmutable($envFile);
    //     $dotenv->load();

    //     // Các biến môi trường hiện đã có sẵn trong $_ENV
    // }

    private function connectDatabase() {
        // 1. Retrieve the configuration array from the Config object
        $dbConfig = $this->config->getDbConfig();

        // 2. Access the credentials using the $dbConfig array
        $dbHost = $dbConfig['dbhost'] ?? null;
        $dbName = $dbConfig['dbname'] ?? null;
        $dbUser = $dbConfig['dbuser'] ?? null;
        $dbPass = $dbConfig['dbpassword'] ?? null;

        // Kiểm tra xem các biến môi trường cần thiết đã được định nghĩa chưa
        if (!$dbHost || !$dbName || !$dbUser) {
            // Xử lý lỗi nếu thiếu cấu hình
            error_log("Missing database environment variables (DB_HOST, DB_NAME, DB_USER).");
            http_response_code(500);
            die("Lỗi cấu hình hệ thống: Thiếu thông tin kết nối cơ sở dữ liệu.");
        }

        $dsn = "pgsql:host=$dbHost;dbname=$dbName";

        $options = [
            // Luôn ném ngoại lệ khi có lỗi SQL
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // Đặt chế độ tìm nạp mặc định là mảng kết hợp
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Tắt chế độ mô phỏng Prepared Statements để tăng cường bảo mật
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $dbUser, $dbPass, $options);
        } catch (PDOException $e) {
            // Xử lý lỗi kết nối cơ sở dữ liệu
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            die("Lỗi hệ thống nội bộ: Không thể kết nối cơ sở dữ liệu.");
        }
    }
}