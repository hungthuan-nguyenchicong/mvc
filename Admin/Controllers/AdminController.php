<?php

class AdminController {
    private $adminModel;

    public function index() {
        if (Session::get('admin')) {
            View::admin('admin', 'admin-index');
            return true;
        } else {
            header('Location: /admin/login/');
            exit;
        }
    }

    public function js($slug = null) {
        if ($slug) {
            $fileName = root(). 'Admin/Views/' . $slug;
            if (strpos($fileName, '.js')) {
                if (is_file($fileName)) {
                    header('Content-Type: application/javascript');
                    readfile($fileName);
                    exit;
                } else {
                    http_response_code(404);
                    echo 'File.js not found';
                    exit;
                }
            } else {
                http_response_code(404);
                echo 'File.js not found - add .js';
                exit;
            }
        } else {
            http_response_code(400);
            echo 'Missing slug parameter: $slug=FileName.js';
            exit;
        }
    }

    public function csrfLogin() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $capcha = $_POST['capcha'];
            if ($capcha === '12345') {
                $csrf = CSRF::apiCsrf();
            } else {
                $csrf = 'dc42099b1e2f439ee4fe9b6ca9645cd129145fe81a745240cadcf5909f15c000';
            }
            header('Content-Type: application/json');
            echo json_encode(['csrf' => $csrf]);
            exit;
        }
    }

    public function csrf() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (Session::get('admin')) {
                $csrf = CSRF::apiCsrf();
            } else {
                $csrf = 'dc42099b1e2f439ee4fe9b6ca9645cd129145fe81a745240cadcf5909f15c000';
            }
            header('Content-Type: application/json');
            echo json_encode(['csrf' => $csrf]);
            exit;
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $response = ['status' => 'error'];
            if (CSRF::controller()) {

                if (isset($_POST['username']) &&  !empty($_POST['username']) && isset($_POST['password']) && !empty($_POST['password'])) {
                    // Validate and sanitize input
                $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS); // neu validate password_has() model
                // $password = $_POST['password']; // Password will be hashed, so no sanitization like htmlspecialchars
                    $login = [
                        'username' => $username,
                        'password' => $password,
                    ];
        
                    Model::admin('AdminModel');
                    $this->adminModel = new AdminModel();
                    if ($this->adminModel->validateLogin($login['username'], $login['password'])) {
                        Session::set('admin', true);
                        $response['status'] = 'success';
                    }
                }
            } else {
                $response['status'] = 'csrf';
            }

            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } else {
            View::admin('admin', 'admin-login');
            exit;
        }
    }

    public function logout() {
        Session::destroy();
        header('Location: /admin/login/');
        exit;
    }
}
?>