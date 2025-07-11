<?php
namespace AdminCore;

use AdminApp\Controllers\AdminController;

class Router {
    private $method;
    private $uri;
    private $adminControllerInstance;
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        //tt($this->uri);
        //echo 'admin/core/router';
        error_log("Router URI received: " . $this->uri); // Thêm dòng này
        $this->adminControllerInstance = new AdminController();

        // router

        // In your PHP router (admin/index.php or similar)
        // To this:
// if ($this->uri === '/admin/check-auth') {
//     $controller = new \AdminApp\Controllers\AdminController();
//     $controller->checkAuth();
//     exit;
// }

        if ($this->method === 'GET' || $this->method === 'POST') {
            switch ($this->uri) {
                case '/admin/':
                    $this->adminControllerInstance->index();
                    break;
                case '/admin/login':
                    $this->adminControllerInstance->login();
                    break;
                case '/admin/logout':
                    $this->adminControllerInstance->logout();
                    break;
                case '/admin/check-auth':
                    $this->adminControllerInstance->checkAuth();
                    break;
                default:
                    http_response_code(404);
                    break;
            }
        } else {
            http_response_code(405);
            exit;
        }
    }
}