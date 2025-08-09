// web-mvc/src/admin/template/pages/posts/post-show.js

function adminPostShow() {
    
    return /* html */ `
        <div id="postShow"></div>
    `;
}

async function requestServer(params = {}) {
    const { id = 1 } = params;
    const response = await fetch(`/admin/api/?PostController@select&id=${id}`);
    const result = await response.json();
    console.log(result)
    render(result.posts[0])
}

function render(post) {
    console.log(post)
    const postElement = document.getElementById('postShow');
    postElement.innerHTML = /* html */ `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    `;
}
export { adminPostShow, requestServer }