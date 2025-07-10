## database class

<?php

class Database {
    private $pdo;
    private static $instance = null;

    // ... (các phần code khác giữ nguyên)

    /**
     * Get the PDO object for database operations.
     *
     * @return PDO
     * @throws Exception If the PDO object is null (connection failed).
     */
    public static function getPDO(): PDO {
        $instance = self::getInstance();
        if ($instance->pdo === null) {
            error_log('PDO object is null after instance creation attempt.');
            throw new Exception('Database connection not established.');
        }
        return $instance->pdo;
    }

    /**
     * Closes the database connection explicitly.
     * This method is useful for long-running scripts or when explicit resource management is needed.
     */
    public static function closeConnection(): void {
        if (self::$instance !== null) {
            self::$instance->pdo = null; // Unset the PDO object
            self::$instance = null; // Unset the instance itself
        }
    }
}

Nếu bạn dùng persistent connections (kết nối bền vững) trong PDO (PDO::ATTR_PERSISTENT => true), PDO sẽ cố gắng tái sử dụng kết nối database đã mở từ các yêu cầu trước đó thay vì mở lại một kết nối mới mỗi lần. Trong trường hợp này, việc gọi closeConnection() tường minh lại càng đi ngược lại mục đích của persistent connection. Tuy nhiên, việc sử dụng persistent connections với PHP cần được cân nhắc kỹ lưỡng vì nó có thể gây ra các vấn đề về trạng thái và tài nguyên nếu không được quản lý cẩn thận. (Lưu ý: trong code của bạn, PDO::ATTR_PERSISTENT mặc định là false nên không áp dụng điều này).