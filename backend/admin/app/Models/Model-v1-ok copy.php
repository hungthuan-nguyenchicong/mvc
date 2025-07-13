<?php
namespace AdminApp\Models;

class Model {
    public function __construct() {
        
    }

    public static function load(string $modelName): bool {
        $modelFile = root(). 'backend/Admin/App/Models/' . $modelName . '.php';
        if (is_file($modelFile)) {
            require_once $modelFile;
            return true;
        } else {
            http_response_code(404);
            error_log('Model file not found' . $modelFile);
            return false;
        }
    }
}