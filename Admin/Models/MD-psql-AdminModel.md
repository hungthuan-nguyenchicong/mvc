# psql

sudo -i -u postgres psql

\c mvcdb

// create table users

CREATE TABLE users (
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

\d users

// insert users

INSERT INTO users (username, password) VALUES ('admin', 'your_super_secret_password');
// password_hash --> adminModel
INSERT INTO users (username, password) VALUES ('admin', '$2y$10$pKgnRonxAf5WcyIAOCRyce0hNXKc/aMfudLjdTzvV4EGwUXc1Xyhu');

// xem hang
SELECT * FROM users;

// đổi tên hàng cho có đúng nghĩa
ALTER TABLE users
RENAME COLUMN password TO password_hash;

// xem hang
SELECT * FROM users;