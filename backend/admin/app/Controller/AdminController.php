<?php
namespace AdminApp\Controller;

class AdminController extends Controller {
    public function __construct() {
        parent::__construct();
        //echo 1;
    }

    public function index() {
        //echo 'admin index';
        header('location: /admin/views/');
    }

    public function login() {
        echo 'login';
    }
}