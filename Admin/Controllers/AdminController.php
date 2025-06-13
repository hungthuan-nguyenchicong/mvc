<?php

class AdminController {
    private $adminModel;

    public function index() {
        View::admin('admin', 'index');
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $response = ['status' => 'error'];
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
                    $response['status'] = 'success';
                }

            }

            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } else {
            View::admin('admin', 'login');
            exit;
        }
    }
}
?>