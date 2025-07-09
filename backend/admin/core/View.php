<?php
namespace AdminCore;

class View {
    public static function render(string $viewPath = null, string $viewName, ?array $data = null): bool {
        $viewFile = root(). 'backend/Admin/App/Views/' . $viewPath . '/' . $viewName . '.php';

        if (is_file($viewFile)) {
            if ($data) {
                extract($data);
            }
            require_once $viewFile;
            return true;
        } else {
            http_response_code(404);
            return false;
        }
    }
}