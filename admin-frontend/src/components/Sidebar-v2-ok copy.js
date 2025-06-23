// src/components/Sidebar.js
import './Sidebar.scss';

export class Sidebar {
    constructor() {
        // Có thể khởi tạo các thuộc tính tại đây
        this.sidebarElement = null; // Biến để lưu trữ phần tử DOM của sidebar
    }

    render() {
        this.sidebarElement = document.createElement('aside'); // Gán phần tử vào thuộc tính của class
        this.sidebarElement.innerHTML = /* html */ `
            <ul>
                <li><a href="/" class="nav-link" data-link>Dashboard</a></li>
                <hr>
                <li>
                    <a href="/posts" class="nav-link" data-link>Tất cả Bài viết</a>
                    <ul>
                        <li><a href="/post/create" data-link>Thêm Mới</a></li>
                        <li><a href="/category/post" data-link>Danh mục bài viết</a></li>
                    </ul>
                </li>
                <hr>
                <li>
                    <a href="/product" class="nav-link" data-link>Tất cả Sản Phẩm</a>
                    <ul>
                        <li><a href="/product/create" data-link>Thêm Mới</a></li>
                        <li><a href="/category/product" data-link>Danh mục Sản phẩm</a></li>
                    </ul>
                </li>
                <hr>
                <li><a href="/settings" class="nav-link" data-link>Cài đặt</a></li>
                <hr>
                <li><a href="/logout" class="nav-link" data-link>Logout</a></li>
            </ul>
        `;
        return this.sidebarElement; // Trả về phần tử DOM
    }

    // Phương thức để gắn các sự kiện
    addEventListeners() {
        if (!this.sidebarElement) {
            console.warn("Sidebar element not rendered yet. Call render() first.");
            return;
        }

        const navLinks = this.sidebarElement.querySelectorAll('a[data-link]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const parentLink = e.currentTarget.parentNode.parentNode.previousElementSibling;
                //e.preventDefault();
                //history.pushState(null, null, e.currentTarget.getAttribute('href'));
                // add active
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    navLink.classList.remove('parent-active');
                });
                e.currentTarget.classList.add('active');
                if (parentLink && parentLink.matches('a[data-link]')) {
                    parentLink.classList.add('parent-active');
                }
            });
        });
    }

    // Hoặc bạn có thể dùng một hàm 'init' để gói gọn cả render và addEventListeners
    // Tuy nhiên, việc tách render và addEventListeners thường linh hoạt hơn
    // nếu bạn muốn render component ở một nơi và gắn listeners ở nơi khác
    // init() {
    //     const renderedElement = this.render();
    //     // Bạn cần chèn renderedElement vào DOM trước khi gọi addEventListeners
    //     // Ví dụ: document.getElementById('app').appendChild(renderedElement);
    //     this.addEventListeners();
    //     return renderedElement;
    // }
}