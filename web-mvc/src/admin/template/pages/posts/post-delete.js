// web-mvc/src/admin/template/pages/posts/post-delete.js

function adminPostDelete(params = {}) {
    const {id = null} = params;
    // return /* html */ `
    // <h2>Post Delete</h2>
    // `;
    return requestServer(id);
}

async function requestServer(id) {
    try {
        const respone = await fetch(`/admin/api/?PostController@delete&id=${id}`, {
            method: 'DELETE',
        });
        const result = await respone.json();
        console.log(result)
    } catch (error) {
        console.error(error);
    }
}

export {adminPostDelete}