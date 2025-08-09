// web-mvc/src/admin/template/pages/posts/post-index.js
async function adminPostIndex() {
    //await requestServer();
    return /* html */ `
    <h2>Post Index</h2>
    <div id="posts"></div>
    `;
}
async function requestServer() {
    const response = await fetch('/admin/api/?PostController@index');
    const result = await response.json();
    //console.log(result.posts)
    renderPosts(result.posts);
}

function renderPosts(posts) {
    const postsElement = document.getElementById('posts');

    let postsToRender = [];
    if (posts) {
        if (Array.isArray(posts)) {
            // posts is already an array
            postsToRender = posts;
        } else {
            // posts is a single object, so wrap it in an array
            postsToRender = [posts];
        }
    }

    if (postsToRender.length > 0) {
        const postsHtml = postsToRender.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.content}</td>
            </tr>
        `).join('');

        postsElement.innerHTML = /* html */ `
            <table border="1">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    ${postsHtml}
                </tbody>
            </table>
        `;
    } else {
        postsElement.innerHTML = '<p>No posts found.</p>';
    }
}

//requestServer()
// console.log(1)
// const contentElement = document.querySelector('.content');
// contentElement.innerHTML = adminPostIndex();
//export {adminPostIndex, requestServer}
export {adminPostIndex, requestServer};