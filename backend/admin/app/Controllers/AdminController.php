<?php
namespace AdminApp\Controllers;

use AdminCore\View;
use AdminCore\Session;
use AdminApp\Models\Model;
use AdminApp\Models\AdminModel;

class AdminController extends Controller {
    private $adminModel;

    public function __construct() {
        parent::__construct();
        //echo 1;
        
    }

    public function index() {
        if (Session::get('admin')) {
            header('location: /admin/views/');
            exit;
        } else {
            header('location: /admin/login');
            exit;
        }
        //echo 'admin index';
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $response = ['status' => 'error'];

            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';

            $login = [
                'username' => $username,
                'password' => $password,
            ];
            Model::load('AdminModel');
            $this->adminModel = new AdminModel();
            $validateLogin = $this->adminModel->validateLogin($login['username'], $login['password']);
            if ($validateLogin) {
                $response['status'] = 'success';
                Session::set('admin', true);
            }

            //$response['login'] = $login;

            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } else {
            View::render(null,'login');
            exit;
        }
    }

    public function logout() {
        Session::destroy();
        header('location: /admin/login');
        exit;
    }

    public function checkAuth() {
        if (Session::get('admin')) {
            // If authenticated:
            // Signal Nginx to proceed with the original request (by returning 200 OK 
            // or by using X-Accel-Redirect if that is necessary for your specific setup).
            //header('X-Accel-Redirect: /admin/check-auth');
            http_response_code(200);
            exit;
        } else {
            // If NOT authenticated:
            // IMPORTANT: DO NOT use header('location: ...') in an auth_request handler.
            // Return an unauthorized status code instead.
            http_response_code(401); // Nginx will respond with 401 Unauthorized
            header('location: /admin/login');
            exit; 
        }
    }
}