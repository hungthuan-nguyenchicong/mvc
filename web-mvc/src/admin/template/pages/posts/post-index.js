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
                    <th>Action Show</th>
                    <th>Action Edit</th>
                    <th>Action Delete</th>
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
    tbodyElement.innerHTML = ''; // Clear existing content first

    if (posts && posts.length > 0) {
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

            // Tạo ô edit id
            const editCell = document.createElement('td');
            const editLink = document.createElement('a');
            editLink.href = `/admin/?p=posts&action=edit&id=${post.id}`;
            editLink.textContent = 'Edit';
            editLink.dataset.postId = post.id; // Add a data attribute to store the post ID
            
            editCell.appendChild(editLink);

            // Tạo button delete
            const deleteCell = document.createElement('td');
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Delete';
            btnDelete.dataset.postId = post.id;
            btnDelete.id = 'btnPostDelete';

            deleteCell.appendChild(btnDelete);
            


            
            // nối ô vào hàng
            row.appendChild(titleCell);
            row.appendChild(contentCell);
            row.appendChild(showCell);
            row.appendChild(editCell);
            row.appendChild(deleteCell);

            // nối hàng vào tbody
            tbodyElement.appendChild(row);
        });
    } else {
        tbodyElement.innerHTML = 'no posts';
    }

    // Add a single event listener to the tbody element
    // Single event listener on the tbody element
    tbodyElement.addEventListener('click', (event) => {
        // Check if the clicked element is an 'a' tag with 'Edit' text
        if (event.target.tagName === 'A' && event.target.textContent === 'Edit') {
            const isConfirmed = confirm('Bạn có muốn sửa bài viết này không?');
            if (!isConfirmed) {
                event.preventDefault(); // Stop the default link behavior
                event.stopPropagation(); // Stop the event from bubbling up
            }
        }
        // delete
        const targetBtnDelete = event.target.closest('#btnPostDelete');
        if (targetBtnDelete) {
            const postId = targetBtnDelete.dataset.postId;
            //console.log(postId)
            const isConfirmed = confirm('Bạn có chắc chắn xóa bài post này không');
            if (isConfirmed) {
                //console.log(postId)
                window.location = `/admin/?p=posts&action=remove&id=${postId}`;
            }
        }
    });

}
export {adminPostIndex, requestServer};