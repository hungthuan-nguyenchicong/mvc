// web-mvc/src/admin/core/uploads/uploadLogic.js

function uploadLogic() {
    const form = document.getElementById('upload');
    if(!form) {
        return;
    }

    const btnSubmit = form.querySelector('button[type="submit"]');
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        //console.log(1)
        requestServer(form)
    })
}

async function requestServer(form) {
    const formData = new FormData(form);
    const response = await fetch('/upload/', {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();
    console.log(result);
}

export {uploadLogic}