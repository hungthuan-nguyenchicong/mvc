// web-mvc/src/admin/template/pages/posts/post-index.js
async function adminPostIndex() {
    //await requestServer();
    return /* html */ `
    <div class="postContent">
        <h2>Post Index</h2>
        <table id="posts" border="1px">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Action Edit</th>
                    <th>Action Show</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    `;
}
async function requestServer() {
    const response = await fetch('/admin/api/?PostController@index');
    const result = await response.json();
    //console.log(result.posts)
    renderPosts(result.posts);
}

function renderPosts(posts) {
    const tbodyElement = document.querySelector('#posts tbody');
    if (posts && posts.length > 0) {
        //console.log(posts)
        
        posts.forEach(post => {
            // taoj moi tr
            const row = document.createElement('tr');
            // Tạo o title
            const titleCell = document.createElement('td');
            titleCell.textContent = post.title;

            // Tạo ô content
            const contentCell = document.createElement('td');
            contentCell.textContent = post.content;
            
            // Tạo ô show id
            const showCell = document.createElement('td');
            const showLink = document.createElement('a');
            showLink.href = `/admin/?p=posts&action=show&id=${post.id}`;
            showLink.textContent = 'Show';
            showCell.appendChild(showLink);
            // nối ô vào hàng
            row.appendChild(titleCell);
            row.appendChild(contentCell);
            row.appendChild(showCell);

            
            // nối hàng vào tbody
            tbodyElement.appendChild(row);
        })
    } else {
        tbodyElement.innerHTML = 'no posts'
    }

}
export {adminPostIndex, requestServer};