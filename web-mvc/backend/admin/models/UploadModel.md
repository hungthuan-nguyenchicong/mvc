## sql postgres

Câu lệnh SQL để tạo bảng `images` trong PostgreSQL có thể như sau:

```sql
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    alt VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Giải thích các thành phần

-----

  * `CREATE TABLE images`: Đây là câu lệnh để tạo một bảng mới với tên là `images`.

  * `id SERIAL PRIMARY KEY`:

      * `SERIAL` là một kiểu dữ liệu đặc biệt trong PostgreSQL, tự động tăng giá trị lên 1 mỗi khi có một hàng (row) mới được thêm vào.
      * `PRIMARY KEY` chỉ định rằng cột `id` là khóa chính. Điều này đảm bảo mỗi giá trị trong cột này là duy nhất và không được phép để trống (`NULL`).

  * `name VARCHAR(255) NOT NULL`:

      * `VARCHAR(255)` là kiểu dữ liệu chuỗi có độ dài tối đa 255 ký tự.
      * `NOT NULL` đảm bảo rằng mỗi bản ghi phải có một giá trị cho cột này, không được để trống.

  * `path VARCHAR(255) NOT NULL`: Cột này dùng để lưu đường dẫn vật lý của tệp hình ảnh trên server.

  * `url VARCHAR(255) NOT NULL UNIQUE`:

      * Cột này lưu đường dẫn URL để truy cập hình ảnh.
      * `UNIQUE` đảm bảo rằng mỗi URL là duy nhất trong bảng, tránh trùng lặp.

  * `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`:

      * Cột này lưu thời gian tạo bản ghi.
      * `TIMESTAMP WITH TIME ZONE` lưu trữ thời gian kèm theo thông tin múi giờ.
      * `DEFAULT CURRENT_TIMESTAMP` tự động điền thời gian hiện tại vào cột này khi một bản ghi mới được tạo, giúp bạn không cần phải tự cung cấp giá trị này.