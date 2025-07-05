// src/views/About.js
export default class About {
    constructor(params) {
        console.log('About View loaded with params:', params);
        this.params = params;
    }

    render() {
        // Trả về một phần tử DOM hoặc một chuỗi HTML
        const div = document.createElement('div');
        div.innerHTML = `
            <h1>Giới thiệu về chúng tôi</h1>
            <p>Đây là trang giới thiệu. Chúng tôi là một ứng dụng SPA sử dụng Webpack và Router tùy chỉnh.</p>
            <p>Quay lại <a href="/" data-link>Trang chủ</a>.</p>
        `;
        return div;
    }

    attachEvents() {
        console.log('About View: attachEvents called');
    }
}
