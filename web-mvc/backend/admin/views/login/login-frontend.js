// web-mvc/backend/admin/views/login/login-frontend.js

const form = document.getElementById('login');
const btnLogin = form.querySelector('button');
//const formData = new FormData(form)

btnLogin.addEventListener('click',(e)=>{
    e.preventDefault();
    requestLogin();
});

async function requestLogin() {
    const formData = new FormData(form)
    const response = await fetch('/admin/login', {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();
    console.log(result.status)
    if (result.status === 200) {
        window.location = '/admin/';
    } else {
        form.reset();
    }
    //console.log(result)
}
