// src/views/Home.js
export default class Home {
    constructor(params) {
        console.log('Home View loaded with params:', params);
        this.params = params;
    }

    render() {
        // Trả về một chuỗi HTML
        return `
            <h1>Chào mừng đến với trang chủ!</h1>
            <p>Đây là nội dung của trang chủ của bạn.</p>
            <p>Bạn có thể điều hướng đến <a href="/about" data-link>Trang Giới thiệu</a>.</p>
            <p>Hoặc xem <a href="/api/posts/post-index" data-link>Danh sách bài viết</a>.</p>
        `;
    }

    // Phương thức tùy chọn để đính kèm các trình lắng nghe sự kiện nếu HTML phức tạp
    attachEvents() {
        console.log('Home View: attachEvents called');
        // const button = document.getElementById('myButton');
        // if (button) {
        //     button.addEventListener('click', () => alert('Button clicked!'));
        // }
    }
}