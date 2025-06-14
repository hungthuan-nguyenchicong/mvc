<?php

class CSRF {
    private static function setCsrf(): string {
        $csrf = bin2hex(random_bytes(32));
        Session::set('csrf', $csrf);
        return $csrf;
    }

    public static function input() {
        return '<input type="hidden" name="csrf" value="'.self::setCsrf().'">';
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