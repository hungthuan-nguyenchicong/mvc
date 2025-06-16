<?php

class LoadContent {
    public function __construct() {
        $this->loadContent();
    }

    private function loadContent() {
        if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
            $queryString = $_SERVER['QUERY_STRING'];
            $params = [];
            parse_str($queryString, $params);
            
            foreach ($params as $action => $param) {
                if (strpos($action, '@')) {
                    list($controllerName, $controllerMethod) = explode('@', $action);
                    $controllerFile = root().'Admin/Controllers/' . $controllerName . '.php';
                    if (is_file($controllerFile)) {
                        require_once $controllerFile;
                        if (class_exists($controllerName)) {
                            $controllerInstance = new $controllerName();
                            if (method_exists($controllerInstance, $controllerMethod)) {
                                // call_user_func([$controllerInstance, $controllerMethod]);
                                $paramMethod = [];
                                // tt($params);
                                // tt($action);
                                foreach ($params as $key => $value) {
                                    if ($key !== $action) {
                                        $paramMethod[$key] = $value;
                                    }
                                }
                                call_user_func_array([$controllerInstance, $controllerMethod], $paramMethod);
                            } else {
                                http_response_code(404);
                                echo 'Controller - no - Method Name';
                                return false;
                            }
                        } else {
                            http_response_code(404);
                            echo 'Controller - no - Class Name';
                            return false;
                        }
                    } else {
                        http_response_code(404);
                        echo 'Controller - no - File Name';
                        return false;
                    }
                }
            }
        } else {
            View::admin('admin', 'admin-default');
        }
    }
}

?>