<?php
namespace AdminCore;

use AdminApp\Controller\AdminController;

class Router {
    private $method;
    private $uri;
    private $adminControllerInstance;
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        //tt($this->uri);
        //echo 'admin/core/router';
        $this->adminControllerInstance = new AdminController();

        // router

        if ($this->method === 'GET' || $this->method === 'POST') {
            switch ($this->uri) {
                case '/admin/':
                    $this->adminControllerInstance->index();
                    break;
                case '/admin/login':
                    $this->adminControllerInstance->login();
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