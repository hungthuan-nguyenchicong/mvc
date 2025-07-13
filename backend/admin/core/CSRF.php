<?php
namespace AdminCore;

use AdminCore\Session;

class CSRF {
    private static function setCsrf(): string {
        $csrf = bin2hex(random_bytes(32));
        Session::set('csrf', $csrf);
        return $csrf;
    }

    // private static function getCsrf():string {
    //     // if (Session::get('csrf')) {
    //     //     return Session::get('csrf');
    //     // }
    //     return self::setCsrf();
    // }

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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['csrf'])) {
                return self::validateCsrf($_POST['csrf']);
            }
        }
        return false;
    }
}