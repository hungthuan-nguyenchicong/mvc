<?php

class Model {
    private static function load(string $modelDir, string $modelName): bool {
        $modelFile = $modelDir . '/Models/' . $modelName . '.php';
        if (is_file($modelFile)) {
            require_once $modelFile;
            return true;
        } else {
            error_log('Model file not found' . $modelFile);
            http_response_code(404);
            echo 'Error: Model not Found';
            return false;
        }
    }

    public static function admin(string $modelName): bool {
        return self::load('./../../Admin', $modelName);
    }
}

?>