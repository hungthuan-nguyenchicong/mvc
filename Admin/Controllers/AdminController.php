<?php

class AdminController {
    private $AdminModel;

    public function index() {
        View::admin('admin', 'index');
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $response = ['status' => 'error'];
            if (isset($_POST['username']) &&  !empty($_POST['username']) && isset($_POST['password']) && !empty($_POST['password'])) {
                $login = [
                    'username' => $_POST['username'],
                    'password' => $_POST['password'],
                ];
    
                Model::admin('AdminModel');
                $this->AdminModel = new AdminModel();
                if ($this->AdminModel->validateLogin($login['username'], $login['password'])) {
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