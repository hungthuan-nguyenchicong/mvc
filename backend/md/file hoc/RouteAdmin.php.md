<?php

class RouteAdmin {
    private $method;
    private $uri;
    private $AdminController;

    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        $adminControllerFile = './../../Admin/Controllers/AdminController.php';
        if (is_file($adminControllerFile)) {
            require_once $adminControllerFile;
            $this->AdminController = new AdminController();
            
            if ($this->method === 'GET' || $this->method === 'POST') {
                switch ($this->uri) {
                    case '/admin/':
                        $this->AdminController->index();
                        break;
                    // case '/admin/js/':
                    //     $this->AdminController->js();
                    //     break;
                    case (preg_match('/^\/admin\/js\/(.*\.js)$/', $this->uri, $matches) ? true : false):
                        $this->AdminController->js($matches[1]);
                        break;
                    case '/admin/csrf-login/':
                        $this->AdminController->csrfLogin();
                        break;
                    case '/admin/csrf/':
                        $this->AdminController->csrf();
                        break;
                    case '/admin/login/':
                        $this->AdminController->login();
                        break;
                    case '/admin/logout/':
                        $this->AdminController->logout();
                        break;
                    default:
                        http_response_code(404);
                        // exit;
                        // header('location: /404.html');
                        echo 'Page 404 not found';
                        break;
                }
            } else {
                http_response_code(405);
                exit;
            }
        } else {
            exit;
        }
    }
}

new RouteAdmin();
?>