<?php
namespace AdminApp\Controllers;

use AdminCore\View;
use AdminCore\Session;
use AdminCore\CSRF;
//use AdminApp\Models\Model;
use AdminApp\Models\AdminModel;

//use AdminApp\Models\TestModel;

class AdminController extends Controller {
    private $adminModel;
    //private $testModel;
    public function __construct() {
        //echo "Debug: AdminController constructor started.<br>"; // Dòng 3
        parent::__construct();
        //echo 1; 
        //echo "Debug: AdminController constructor finished.<br>"; // Dòng 4
        //$this->testModel = new TestModel();
        //$this->testModel->testDatabase();
        //echo __CLASS__;
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

            if (CSRF::controller()) {
                // $username = $_POST['username'] ?? '';
                // $password = $_POST['password'] ?? '';
                
                // Validate and sanitize input
                $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS); // neu validate password_has() model
                // $password = $_POST['password']; // Password will be hashed, so no sanitization like htmlspecialchars

                $login = [
                    'username' => $username,
                    'password' => $password,
                ];
                // Model::load('AdminModel');
                try {
                    $this->adminModel = new AdminModel();
                    $validateLogin = $this->adminModel->validateLogin($login['username'], $login['password']);
                    if ($validateLogin) {
                        $response['status'] = 'success';
                        Session::set('admin', true);
                    }
                } catch (Exception $e) {
                    error_log($e->getMessage());
                }
            } else {
                $response['status'] = 'csrf';
            }

            //$response['login'] = $login;

            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } else {
            //echo "Debug: Reached login GET route.<br>"; // Dòng 5 (đã thêm trước đó)
            View::render(null,'login');
            //echo "Debug: Rendered successfully.<br>"; // Dòng 6
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
            //http_response_code(401); // Nginx will respond with 401 Unauthorized
            //header('location: /admin/login');
            //header('X-Accel-Redirect: /admin/check-auth');
            //View::render(null,'login');
            http_response_code(401); // Nginx will respond with 401 Unauthorized
            //header('location: /admin/login');
            exit; 
        }
    }

}