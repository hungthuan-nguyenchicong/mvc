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
    console.log(result)
    if (result.status === 302) {
        window.location = '/admin/'
    } else {
        //console.log(result)
        errorMessage(result.message);
    }
    //console.log(await response.status)
    //console.log()
    // if (!result.ok) {
    //     //window.location = '/admin/';
    //     console.log(result)
    // }
//     if (response.status === 302) {
//     console.log('Redirect detected to:', response.headers.get('Location'));
//   } else {
//     console.log('Response status:', response.status);
//   }
    // } else {
    //     form.reset();
    //     console.log(2)
    // }
    //console.log(result)
}

function errorMessage(errorMessage) {
    const errdiv = document.createElement('div');
    errdiv.className = 'formError';
    errdiv.textContent = errorMessage;
    // Thêm CSS trực tiếp vào phần tử
    errdiv.style.color = 'red';
    errdiv.style.marginTop = '25px';
    form.appendChild(errdiv);
}
