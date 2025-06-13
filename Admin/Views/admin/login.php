<h3>Login</h3>
<form id="login">
    <input type="text" name="username" placeholder="User Name" autocomplete="username" required>
    <input type="password" name="password" placeholder="Password" autocomplete="current-password" required>
    <button type="submit">Login</button>
    <div class="error"></div>
</form>

<style>
    h3 {
        text-align: center;
        padding-top: 150px;
    }
    #login {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 35%;
        margin: auto;
    }
    button {
        cursor: pointer;
    }
    .error {
        color: red;
    }
</style>

<script>
    function tt(t) {
        console.log(t);
    }
    class Login {
        constructor() {
            this.form = document.getElementById('login');
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.errorDiv = this.form.querySelector('.error');
        }

        handleSubmit(e) {
            e.preventDefault();
            this.sendAdminController_login();
        }

        async sendAdminController_login() {
            const formData = new FormData(this.form);
            const response = await fetch('/admin/login/', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.status === 'success') {
                this.form.reset();
                location.href = '/admin/';
            } else {
                this.form.reset();
                this.errorDiv.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        new Login();
    });
</script>