<?php
namespace AdminApp\Models;
use AdminCore\ENV;

class Model {
    // Khai báo một thuộc tính để lưu trữ đối tượng ENV
    protected $env;
    protected $load;
    public function __construct() {
        // Gán đối tượng ENV vào thuộc tính $env
        $this->env = new ENV();
        //$this->load = $this->loadMdel();
        //$loadfile = $this->load;
        //echo $this->load;
        $this->loadMdel();
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

    public function loadMdel() {
        // $this->load =  get_class($this);
        // return $this->load;
        echo get_class($this);
    }
}