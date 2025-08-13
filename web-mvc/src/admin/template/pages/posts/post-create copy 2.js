// web-mvc/src/admin/template/pages/posts/post-create.js
import { dispatchCrudMessage } from "../../parts/flatMessage";
function adminPostCreate() {
    //await requestServer()
    return /* html */ `
    <form id="create">
        <h2>Post create</h2>
        <label>Title:
            <br><input type="text" name="title">
        </label><br>
        <label>Content: 
            <br><textarea name="content"></textarea>
        </label><br>
        <button type="submit">Create Post</button>
        <div class="error"></div>
    </form>
    `;
}

//const form = document.getElementById('create');

function handleFormSubmit() {
    const form = document.getElementById('create');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            requestServer(form);
        })
    }
}

async function requestServer(form) {
    try {

        const formData = new FormData(form);
        const response = await fetch('/admin/api/?PostController@create',{
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        //console.log(result);
        if (result.message === 'success') {
            history.pushState(null, null, '/admin/?p=posts&action=index');
            //adminRouterFrontend();
            
            dispatchCrudMessage('Sản phẩm đã được tạo thành công', 'success');
        } else {
            //console.log(result)
            dispatchCrudMessage('Lỗi khi tạo sản phẩm', 'error');
        }
        // error.errno 23505
        if (result.error === '23505') {
            const errorElement =  form.querySelector('.error');
            errorElement.style.color = 'red';
            errorElement.innerHTML = 'Title bị trùng vui loàn chọn tên khác!';

        }
        
    } catch (error) {
        console.error(error);
    }
    //const form = document.getElementById('create');
}

export {adminPostCreate, handleFormSubmit}