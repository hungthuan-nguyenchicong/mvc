# PostgreSQL
sudo apt install postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql

## cau lenh co ban
sudo -i -u postgres
psql // user postgress

\l // list database
\du // display user
\du name_db // cac quyen user voi name_db
\q // thoat

psql -h localhost -p 5432 -U cong -d postgres
\dp
\dn+ public

## thu hoi quyn 
REVOKE CONNECT ON DATABASE postgres FROM PUBLIC;
REVOKE CONNECT ON DATABASE name_db FROM PUBLIC;

## cap lai quyen conect
sudo -i -u postgres
psql // user postgress
GRANT CONNECT ON DATABASE name_db TO user_name;

### Chuyển đổi sang database bạn muốn kiểm tra:
\c mvcdb
\dt // xem table
\dtS // xem he thong
SELECT current_database(); // xac nhan dang o dau
SELECT current_user;

SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'mvcdb'; //để chấm dứt các phiên làm việc đang kết nối tới database mvcdb.

### doi user voi phien lam viec

psql -h localhost -p 5432 -U user_name -d mvcdb

### Các quyền thường thấy bao gồm:
Việc hiểu rõ quyền arwdDxt và rwU là rất quan trọng để biết người dùng có thể làm gì. Cụ thể:
a (INSERT - append): Chèn dữ liệu.
r (SELECT - read): Đọc dữ liệu.
w (UPDATE - write): Cập nhật dữ liệu.
d (DELETE): Xóa dữ liệu.
D (TRUNCATE): Cắt bớt bảng.
x (REFERENCES): Tạo ràng buộc khóa ngoại.
t (TRIGGER): Tạo trigger.
U (USAGE): Sử dụng sequence (quan trọng cho khóa chính tự động tăng).

### tham khao cac quyen

REVOKE CONNECT ON DATABASE mvcdb FROM PUBLIC;
REVOKE TEMPORARY ON DATABASE mvcdb FROM PUBLIC;
GRANT TEMPORARY ON DATABASE mvcdb TO ten_ung_dung_php;

## truy cap
sudo -u postgres psql
\l
### tao tk user
CREATE USER ten_tai_khoan_moi WITH PASSWORD 'mat_khau_cua_ban';

-->> xoa DROP USER ten_tai_khoan_moi;

\du

### cap quyen user
ALTER ROLE admin_user WITH SUPERUSER; // han che
ALTER ROLE cong WITH NOSUPERUSER; // xoa quyen admin
\du

### tao database
CREATE DATABASE ten_database_ung_dung;
-->> tao va cap quyen so hu
CREATE DATABASE my_app_db OWNER admin_user;
\l
-->> neu da tao
ALTER DATABASE mvcdb OWNER TO admin_user;
\l

## ket noi db
psql -h localhost -p 5432 -U user_name -d mvcdb
\dt
\d test // xem cau truc table


### phan quyen DB
GRANT .. ON 
#### quen CONNECT
REVOKE CONNECT ON DATABASE mvcdb FROM PUBLIC; // thu hoi toan bo quyen voi db

### test quyen truy cap

GRANT CONNECT ON DATABASE mvcdb TO user_name;

// kiem tra quyen SCHEMA
\dn+ public
// CRUD cơ bản

GRANT USAGE ON SCHEMA public TO user_name;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO user_name; // all table cho hien tai

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cong; // table cho tuong lai

### cấp quyền insert SEQUENCE 
id SERIAL PRIMARY KEY,
GRANT USAGE ON SEQUENCE test_id_seq TO cong; // 1 bang cu the

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO cong; // các bảng tương lai -->> nếu tồn tại bảng cũ -> phải cấp quyền từng bảng

### Tóm tắt:

GRANT ON ALL TABLES: Dành cho các bảng đã tồn tại (hiện tại).
ALTER DEFAULT PRIVILEGES ON TABLES: Dành cho các bảng sẽ được tạo trong tương lai.

## php-pgsql
sudo apt install php-pgsql

## test

<?php
$host = 'your_postgres_host'; // Ví dụ: 'localhost'
$dbname = 'your_database_name';
$user = 'your_username';
$password = 'your_password';

try {
    // Tạo đối tượng PDO để kết nối tới PostgreSQL
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);

    // Thiết lập chế độ báo lỗi (tùy chọn nhưng rất khuyến khích)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // Tắt emulate prepares để tăng cường bảo mật

    echo "Kết nối tới cơ sở dữ liệu PostgreSQL thành công!";

    // Ví dụ về truy vấn dữ liệu
    $stmt = $pdo->query("SELECT version()");
    $version = $stmt->fetchColumn();
    echo "<br>Phiên bản PostgreSQL: " . $version;

} catch (PDOException $e) {
    // Bắt lỗi nếu có vấn đề trong quá trình kết nối
    echo "Lỗi kết nối tới cơ sở dữ liệu PostgreSQL: " . $e->getMessage();
}
?>

## tao bang test

CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    test VARCHAR(100) NULL
);

CREATE TABLE test2 (
    id SERIAL PRIMARY KEY,
    test VARCHAR(100) NULL
);
CREATE TABLE test3 (
    id SERIAL PRIMARY KEY,
    test VARCHAR(100) NULL
);

## xoa bang

DROP TABLE test2;