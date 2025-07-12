## csrf

<?php

class CSRF {
    private static function setCsrf(): string {
        $csrf = bin2hex(random_bytes(32));
        Session::set('csrf', $csrf);
        return $csrf;
    }

    // Thay đổi hàm getCsrf()
    private static function getCsrf(): string {
        // Kiểm tra xem token CSRF đã tồn tại trong session chưa
        if (Session::get('csrf')) {
            // Nếu có, trả về token hiện có
            return Session::get('csrf');
        }
        // Nếu chưa có, tạo token mới và lưu vào session
        return self::setCsrf();
    }

    public static function input() {
        return '<input type="hidden" name="csrf" value="'.self::getCsrf().'">';
    }

    public static function apiCsrf(): string {
        $csrf = self::getCsrf();
        return $csrf;
    }

    private static function validateCsrf($csrf): bool {
        if (Session::get('csrf') === $csrf) {
            Session::destroy('csrf');
            return true;
        } else {
            Session::destroy('csrf');
            return false;
        }
    }

    public static function controller(): bool {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['csrf'])) {
                return self::validateCsrf($_POST['csrf']);
            }
        }
        return false;
    }
}

?>