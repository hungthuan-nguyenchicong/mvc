// main.js content
import './main.scss';
import './hoc-vi-du-co-ban/nav.scss';
import './hoc-vi-du-co-ban/main.scss';

// Lấy phần tử gốc app từ DOM
const app = document.getElementById('app');

// Tạo phần tử nav (thanh điều hướng)
const navElement = document.createElement('nav');
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
    </ul>
`;
app.appendChild(navElement); // Thêm nav vào phần tử app

// Định nghĩa các routes (đường dẫn) và nội dung trang tương ứng
const routes = {
    '/': {
        title: 'Trang chủ',
        content: /* html */ `
            <h1>Chào mừng đến với Trang chủ</h1>
            <p>Đây là một ứng dụng SPA VanillaJS đơn giản</p>
            <p>Điều hướng bằng cách sử dụng các liên kết ở trên.</p>
        `
    },
    '/about': {
        title: 'Về chúng tôi',
        content: /* html */ `
            <h1>Về chúng tôi</h1>
            <p>Chúng tôi đang học các ứng dụng SPA VanillaJS</p>
            <p>Trang này minh họa định tuyến phía máy khách</p>
        `
    },
    '/contact': {
        title: 'Liên hệ',
        content: /* html */ `
            <h1>Liên hệ với chúng tôi</h1>
            <p>Bạn có thể liên hệ với chúng tôi tại example@example.com</p>
        `
    },
    '/404': {
        title: 'Không tìm thấy trang',
        content: /* html */ `
            <h1>404 - Không tìm thấy trang</h1>
            <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
            <p><a href="/" data-path="/">Đi tới Trang chủ</a></p>
        `
    }
}

// Tạo phần tử main để chứa nội dung trang
const mainContent = document.createElement('main');
app.appendChild(mainContent); // Thêm main vào phần tử app

// Hàm hiển thị nội dung trang dựa trên đường dẫn
const renderContent = (path) => {
    // Lấy thông tin trang từ routes, mặc định là trang 404 nếu không tìm thấy
    const page = routes[path] || routes['/404'];
    
    // Cập nhật tiêu đề của tài liệu
    document.title = page.title;
    
    // Chèn nội dung trang vào phần tử mainContent
    mainContent.innerHTML = page.content;

    // Cập nhật trạng thái active cho các liên kết điều hướng
    document.querySelectorAll('a[data-path]').forEach(link => {
        if (link.getAttribute('data-path') === path) {
            link.classList.add('active'); // Thêm class 'active' nếu liên kết khớp với đường dẫn hiện tại
        } else {
            link.classList.remove('active'); // Loại bỏ class 'active' nếu không khớp
        }
    });
}

// Hàm xử lý khi người dùng click vào một liên kết có thuộc tính data-path
// Function to handle navigation when a data-path link is clicked
const navigate = (path) => { // Modified to accept path directly
    // Update URL in the address bar without reloading the page
    // window.history.pushState(state, title, url)
    window.history.pushState({}, '', path);
    
    // Display content corresponding to the new path
    renderContent(path);
};

// Hàm xử lý sự kiện popstate (khi người dùng sử dụng nút Back/Forward của trình duyệt)
const handlePopState = () => {
    // Hiển thị nội dung trang dựa trên đường dẫn hiện tại trong URL
    renderContent(window.location.pathname);
}

// Initialize SPA application
// 1. Listen for clicks on links with data-path attribute using event delegation
app.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[data-path]'); // Find the closest matching anchor element
    if (targetLink) {
        e.preventDefault(); // Prevent default link behavior (page reload)
        const path = targetLink.getAttribute('data-path');
        navigate(path);
    }
});

// 2. Lắng nghe sự kiện popstate để xử lý nút Back/Forward của trình duyệt
window.addEventListener('popstate', handlePopState);

// 3. Hiển thị nội dung trang ban đầu khi ứng dụng vừa tải (hoặc trang hiện tại nếu có trong URL)
// Call initial renderContent
renderContent(window.location.pathname);

// Xử lý các đường dẫn không hợp lệ khi người dùng truy cập trực tiếp vào URL
// Or when the page is reloaded on an invalid path
if (!routes[window.location.pathname]) {
    // Thay đổi URL thành /404 mà không thêm vào lịch sử trình duyệt
    window.history.replaceState({}, '', '/404');
    
    // Hiển thị nội dung trang 404
    renderContent('/404');
}