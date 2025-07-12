<?php
namespace AppCore;

class CSRF {
    private static function setCsrf(): string {
        $csrf = bin2hex(random_bytes(32));
        Session::set('csrf', $csrf);
        return $csrf;
    }

    private static function getCsrf():string {
        if (Session::get('csrf')) {
            return Session::get('csrf');
        }
        return self::setCsrf();
    }
}