// web-mvc/src/admin/template/pages/posts/post-create.js

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
    </form>
    `;
}

//const form = document.getElementById('create');

function handleSubmit() {
    const form = document.getElementById('create');
    const btnCreate = form.querySelector('button');
    btnCreate.addEventListener('click', (e) => {
        e.preventDefault();
        requestServer();
    })
}

async function requestServer() {
    const form = document.getElementById('create');
    const formData = new FormData(form);
    const response = await fetch('/admin/api/?PostController@create',{
        method: "POST",
        body: formData,
    });
    const result = await response.json();
    console.log(result);
}

function init() {
    handleSubmit();
}
export {adminPostCreate, init}