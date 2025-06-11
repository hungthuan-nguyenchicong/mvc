<?php

class View {
    public static function render($viewDir, $viewPath, $viewName, $data = null) {
        $viewFile = $viewDir . '/Views/' . $viewPath . '/' . $viewName . '.php';
        if (is_file($viewFile)) {
            require_once $viewFile;
            if ($data) {
                extract($data);
            }
        } else {
            http_response_code(404);
            echo 'no view File: ' . $viewFile;
            return false;
        }
    }

    public static function admin($viewPath, $viewName, $data = null) {
        self::render('./../../Admin', $viewPath, $viewName, $data = null);
    }
}

?>