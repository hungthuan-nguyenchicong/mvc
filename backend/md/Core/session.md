# session

<?php

class Session {
    private static $sessionStarted = false;

    public static function start() {
        if (!self::$sessionStarted) {
            self::$sessionStarted = session_start();
        }
        return self::$sessionStarted;
    }

    public static function set(string $key, string $value) {
        if (!self::$sessionStarted) {
            self::start();
        }
        $_SESSION[$key] = $value;
    }

    public static function get(string $key) {
        if (!self::$sessionStarted) {
            self::start();
        }
        return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
    }

    public static function destroy(string $key = null) {
        if (!self::$sessionStarted) {
            self::start();
        }
        if ($key) {
            unset($_SESSION[$key]);
        } else {
            session_unset();
            session_destroy();
            self::$sessionStarted = false;
        }
    }
}

?>