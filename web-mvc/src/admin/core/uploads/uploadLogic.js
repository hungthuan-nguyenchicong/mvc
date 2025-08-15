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
    try {
        const formData = new FormData(form);
        const response = await fetch('/admin/api/?UploadController@create', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        //console.log(result);
        // test
        // const img = document.createElement('img');
        // img.src = result.src;
        // form.appendChild(img);
        if (result.message === 'success') {
            form.reset();
            const tabUploadEvent = new CustomEvent('tabUpload', {detail:{tabId:'tabGallery'}});
            document.dispatchEvent(tabUploadEvent);
        }

    } catch (error) {
        console.error(error);
    }
}

export {uploadLogic}