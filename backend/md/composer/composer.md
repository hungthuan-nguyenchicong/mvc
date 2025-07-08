## run composer

cd /var/www/html/mvc/backend

composer dump-autoload

## note
vendor/autoload.php

composer install

composer update

composer dump-autoload

composer install --no-dev

### thm khao

Khi bạn chạy composer install hoặc composer update mà không có cờ --no-dev, Composer sẽ cài đặt cả các dependency yêu cầu trong require và require-dev. Đây là hành vi mặc định và phù hợp cho môi trường phát triển (development).

### Tóm tắt:

Dev: composer install (cài tất cả, tạo composer.lock).

Build/Pre-deploy: composer install --no-dev (chỉ cài dependencies production, tạo vendor/ và autoload.php cho production).

Deploy: Copy toàn bộ thư mục đã được "built" này lên server.

Cách làm này đảm bảo rằng môi trường production của bạn gọn gàng, hiệu quả và đáng tin cậy hơn.
