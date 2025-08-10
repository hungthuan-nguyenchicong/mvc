// web-mvc/src/admin/template/pages/posts/post-edit.js

function adminPostEdit() {
    return /* html */ `
    <form id="postEdit">
        <h2>Post Edit</h2>
    </form>
    `;
}

async function requestServer(params = {}) {
    try {
        const {id = 1} = params;
        const response = await fetch(`/admin/api/?PostController@edit&id=${id}`);
        const result = await response.json();
        //console.log(result)
        render(result.posts)

    } catch (error) {
        console.error(error);
    }
}

function render(posts) {
    const form = document.getElementById('postEdit');
    if (posts && posts.length > 0) {
        //console.log(posts)
        posts.forEach(post => {
            // trương ẩn post id
            const inputId = document.createElement('input');
            inputId.type = 'hidden';
            inputId.name = 'id';
            inputId.value = post.id;

            form.appendChild(inputId);

            
            // input title
            const labelTitle = document.createElement('label');
            labelTitle.textContent = `Title:`;
            

            const inputTitle = document.createElement('input');
            inputTitle.name = 'title'
            inputTitle.value = post.title;
            inputTitle.style.display = 'block';

            labelTitle.appendChild(inputTitle);
            
            form.appendChild(labelTitle);

            // input Content
            const labelContent = document.createElement('label');
            labelContent.textContent = 'Content:';

            const textareaContent = document.createElement('textarea');
            textareaContent.name = 'content';
            textareaContent.textContent = post.content;
            textareaContent.style.display = 'block';

            labelContent.appendChild(textareaContent);
            form.appendChild(labelContent);

            // button
            const buttonUpdate = document.createElement('button');
            buttonUpdate.type = 'submit';
            buttonUpdate.textContent = 'Update';

            form.appendChild(buttonUpdate);

            

        });
        requestUpdateServer();
    } else {
        form.textContent = 'no post id'
    }

}

function requestUpdateServer() {
    const form = document.getElementById('postEdit');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // hiển thị hôi thoại xác nhận
        const isConfirmed = window.confirm('Bận có chắc chắn muốn cập nhật bài viết');
        if (isConfirmed) {
            update(form);
        }
    });
}

async function update(form) {
    try {
        const formData = new FormData(form);
        const responst = await fetch('/admin/api/?PostController@update', {
            method: 'PUT',
            body: formData,
        })
        const result = await responst.json();
        //console.log(result);
        if (result.message === 'success') {
            window.location = '/admin/?p=posts&action=index';
        }
    } catch (error) {
        console.error(error);
    }
}

export {adminPostEdit, requestServer}