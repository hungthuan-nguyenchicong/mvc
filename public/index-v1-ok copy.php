<h1>index.php</h1>
<?php
$host = 'localhost'; // Ví dụ: 'localhost'
$dbname = 'mvcdb';
$user = 'cong';
$password = 'Cong12345';

try {
    // Tạo đối tượng PDO để kết nối tới PostgreSQL
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);

    // Thiết lập chế độ báo lỗi (tùy chọn nhưng rất khuyến khích)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // Tắt emulate prepares để tăng cường bảo mật

    echo "Kết nối tới cơ sở dữ liệu PostgreSQL thành công!";

    // Ví dụ về truy vấn dữ liệu
    // $sql = "SELECT version()";
    $sql = "SELECT 1";

    $stmt = $pdo->query($sql);
    $version = $stmt->fetchColumn();
    echo "<br>Phiên bản PostgreSQL: " . $version;

} catch (PDOException $e) {
    // Bắt lỗi nếu có vấn đề trong quá trình kết nối
    echo "Lỗi kết nối tới cơ sở dữ liệu PostgreSQL: " . $e->getMessage();
}
?>