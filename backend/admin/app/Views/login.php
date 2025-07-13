<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        h1 {
            text-align: center;
            padding-top: 100px;
        }
        form#login {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 35%;
            margin: auto;
        }
        form#login input {
            /* width: 350px;       Chiều rộng mong muốn */
            padding: 12px 20px; /* Tăng khoảng đệm bên trong */
            font-size: large;    /* Tăng kích thước chữ */
            border: 1px solid gray; /* Thêm viền để dễ nhìn */
            border-radius: 5px; /* Bo góc nhẹ cho đẹp */
        }
        form#login button {
            /* width: 350px;       Chiều rộng mong muốn */
            padding: 12px 20px; /* Tăng khoảng đệm bên trong */
            font-size: large;    /* Tăng kích thước chữ */
            border: 1px solid gray; /* Thêm viền để dễ nhìn */
            border-radius: 5px; /* Bo góc nhẹ cho đẹp */
            cursor: pointer;
        }
        form#login .error {
            text-align: center;
            margin-top: 40px;
            color: red;
        }
    </style>
</head>
<?php
use AdminCore\CSRF;
$csrf = CSRF::input();
?>
<body>
    <h1>Login</h1>
    <form id="login">
        <input type="text" name="username" placeholder="User Name" autocomplete="username" required>
        <input type="password" name="password" placeholder="Password" autocomplete="new-password" required>
        <?=$csrf ?>
        <button type="submit">Login</button>
        <div class="error"></div>
    </form>
    <script>
        function tt(t) {
            console.log(t);
        }

        class Login {
            constructor() {
                this.form = document.getElementById('login');
                this.form.addEventListener('submit',this.handleSubmit.bind(this));
                this.divError = this.form.querySelector('.error');
                
            }

            handleSubmit(e) {
                e.preventDefault();
                this.sendAdminController_login();
            }

            async sendAdminController_login() {
                try {
                    const formData = new FormData(this.form);
                    const response = await fetch('/admin/login', {
                        method: 'POST',
                        body: formData,
                    });
                    const result = await response.json();
                    //tt(result)
                    if (result.status === 'success') {
                        window.location.href = '/admin/';
                    } else if(result.status === 'csrf') {
                        //window.location.reload();
                        this.form.reset();
                    } else {
                        this.form.reset();
                        this.divError.textContent = 'Tài khoản hoặc mật khẩu không đúng';
                    }
                } catch (error) {
                    console.error(error);
                    this.divError.textContent = 'Đã xảy ra lỗi khi kết nối';
                }
            }
        }

        document.addEventListener('DOMContentLoaded',()=>{
            new Login();
        })
    </script>
</body>
</html>
