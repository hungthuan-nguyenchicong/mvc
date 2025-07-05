// src/views/posts/PostDetail.js
export default class PostDetail {
    constructor(params) {
        console.log('Post Detail View loaded with params:', params);
        this.params = params; // params sẽ chứa { id: 'giá_trị_id' }
        this.post = null; // Sẽ tải dữ liệu bài viết
    }

    // Sử dụng getHtml nếu bạn cần xử lý bất đồng bộ trước khi render
    async getHtml() {
        const postId = this.params.id;
        // Giả lập việc lấy dữ liệu từ API
        // Trong thực tế, bạn sẽ gọi fetch hoặc axios ở đây
        await new Promise(resolve => setTimeout(resolve, 300)); // Giả lập độ trễ mạng
        const allPosts = [
            { id: '1', title: 'Bài viết đầu tiên', content: 'Đây là nội dung chi tiết của bài viết số 1, rất dài và thú vị.' },
            { id: '2', title: 'Bài viết thứ hai', content: 'Nội dung chi tiết của bài viết số 2, với nhiều thông tin hữu ích.' },
            { id: '3', title: 'Bài viết thứ ba', content: 'Nội dung của bài viết số 3, cung cấp cái nhìn sâu sắc.' },
        ];
        this.post = allPosts.find(p => p.id === postId);

        if (!this.post) {
            return `
                <h1>Bài viết không tìm thấy</h1>
                <p>Bài viết với ID "${postId}" không tồn tại.</p>
                <p>Quay lại <a href="/api/posts/post-index" data-link>Danh sách bài viết</a>.</p>
            `;
        }

        return `
            <h1>${this.post.title}</h1>
            <p><strong>ID bài viết:</strong> ${this.post.id}</p>
            <p>${this.post.content}</p>
            <p>Quay lại <a href="/api/posts/post-index" data-link>Danh sách bài viết</a>.</p>
        `;
    }

    attachEvents() {
        console.log('Post Detail View: attachEvents called');
    }
}