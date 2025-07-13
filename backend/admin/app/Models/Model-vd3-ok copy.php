<?php
namespace AdminApp\Models;
use AdminCore\ENV;

class Model {
    // Khai báo một thuộc tính để lưu trữ đối tượng ENV
    protected $env;
    protected $loadFileName;
    protected function __construct() {
        // Gán đối tượng ENV vào thuộc tính $env
        //$this->env = new ENV();
        //$this->load = $this->loadMdel();
        //$loadfile = $this->load;
        //echo $this->load;
        //echo $this->loadFileName;
        // Call loadFileModel here to set $this->loadFileName
        //$this->loadFileModel();
        // Now $this->loadFileName has a value and can be echoed
        //echo "Inside constructor: " . $this->loadFileName . "\n";

        //$this->load();

        // Set $this->loadFileName by calling loadFileModel()
        //$this->loadFileModel();

        // Now call load(), which uses the initialized $this->loadFileName
        //$this->load();
    }

    // public static function load(string $modelName): bool {
    //     $modelFile = root(). 'backend/Admin/App/Models/' . $modelName . '.php';
    //     if (is_file($modelFile)) {
    //         require_once $modelFile;
    //         return true;
    //     } else {
    //         http_response_code(404);
    //         error_log('Model file not found' . $modelFile);
    //         return false;
    //     }
    // }

    private function load(): bool {
        $modelName = $this->loadFileName;
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

    private function loadFileModel() {
        // $this->load =  get_class($this);
        // return $this->load;
        $fullClassNameModel = get_class($this);
        $parts = explode('\\', $fullClassNameModel);
        $nameModel = end($parts);
        //return $nameModel;
        $this->loadFileName = $nameModel;
        return $this->loadFileName;
    }
}