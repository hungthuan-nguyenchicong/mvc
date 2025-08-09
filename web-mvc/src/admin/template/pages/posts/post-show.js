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
    //console.log(result)
    render(result.posts)
}

// function render(post) {
//     console.log(post)
//     const postElement = document.getElementById('postShow');
//     postElement.innerHTML = /* html */ `
//     <h3>${post.title}</h3>
//     <p>${post.content}</p>
//     `;
// }

function render(posts) {
    const postElement = document.getElementById('postShow')
    if (posts && posts.length > 0) {
        posts.forEach(post => {
            // post title
            const postTitle = document.createElement('h3');
            postTitle.textContent = post.title;
            postElement.appendChild(postTitle);

            // post content
            const postContent  = document.createElement('p');
            postContent.textContent = post.content;
            postElement.appendChild(postContent);
        });
    } else {
        postElement.textContent = 'no post id';
    }
}
export { adminPostShow, requestServer }