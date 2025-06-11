<?php

class AdminController {

    public function index() {
        View::admin('admin', 'index');
    }

    public function login() {
        View::admin('admin', 'login');
    }
}
?>