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
        //console.log(result)
        if (result.message === 'success') {
            const crudEvet = new CustomEvent('crudMessage', {detail: {
                message: 'Xóa thành công',
                type: 'success',
            }});
            document.dispatchEvent(crudEvet);
        } else {
            const crudEvet = new CustomEvent('crudMessage', {detail: {
                message: 'Xóa bị lỗi',
                type: 'error',
            }});
            document.dispatchEvent(crudEvet);
        }
        history.pushState(null, null, '/admin/?p=posts&action=index');
        const navEvent = new CustomEvent('navigated', {detail: {href: '/admin/?p=posts&action=index'}});
        document.dispatchEvent(navEvent);
    } catch (error) {
        console.error(error);
    }
}

export {adminPostDelete}