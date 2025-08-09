## md

// web-mvc/src/admin/template/pages/posts/post-index.js
async function adminPostIndex() {
    // Gọi hàm requestServer ngay khi trang được tải
    await requestServer(); 
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
    renderPosts(result.posts);
}

function renderPosts(posts) {
    const tbodyElement = document.querySelector('#posts tbody');
    // Xóa nội dung cũ để tránh lặp lại khi render lại
    tbodyElement.innerHTML = ''; 

    posts.forEach(post => {
        // Tạo hàng mới (tr)
        const row = document.createElement('tr'); 
        
        // Tạo ô Title (td)
        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;
        
        // Tạo ô Content (td)
        const contentCell = document.createElement('td');
        contentCell.textContent = post.content;
        
        // Tạo ô Action Edit (td) với nút hoặc link
        const editCell = document.createElement('td');
        const editLink = document.createElement('a');
        editLink.href = `/admin/posts/edit/${post.id}`;
        editLink.textContent = 'Edit';
        editCell.appendChild(editLink);
        
        // Tạo ô Action Show (td) với nút hoặc link
        const showCell = document.createElement('td');
        const showLink = document.createElement('a');
        showLink.href = `/admin/posts/show/${post.id}`;
        showLink.textContent = 'Show';
        showCell.appendChild(showLink);
        
        // Nối các ô vào hàng
        row.appendChild(titleCell);
        row.appendChild(contentCell);
        row.appendChild(editCell);
        row.appendChild(showCell);
        
        // Nối hàng vào tbody
        tbodyElement.appendChild(row);
    });
}

export {adminPostIndex, requestServer};

## học DOM
// Giả định bạn có một bảng với id là 'myTable'
<table id="myTable">
    <thead>
        <tr>
            <th>Cột 1</th>
            <th>Cột 2</th>
        </tr>
    </thead>
    <tbody>
        </tbody>
</table>

// Mã JavaScript để thêm một hàng mới
function addRowToTable(data1, data2) {
    // 1. Tìm tbody
    const tbody = document.querySelector('#myTable tbody');

    // 2. Tạo hàng mới
    const newRow = document.createElement('tr');

    // 3. Tạo các ô và điền dữ liệu
    const cell1 = document.createElement('td');
    cell1.textContent = data1;

    const cell2 = document.createElement('td');
    cell2.textContent = data2;
    
    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    
    // 4. Chèn hàng vào tbody
    tbody.appendChild(newRow);
}

// Gọi hàm để thêm một hàng mới vào bảng
addRowToTable('Dữ liệu hàng mới 1', 'Dữ liệu hàng mới 2');