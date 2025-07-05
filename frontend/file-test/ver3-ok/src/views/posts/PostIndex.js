// src/views/posts/PostIndex.js
export default class PostIndex {
    constructor(params) {
        console.log('Post Index View loaded with params:', params);
        this.params = params;
        this.posts = [
            { id: '1', title: 'Bài viết đầu tiên', content: 'Nội dung bài viết số 1.' },
            { id: '2', title: 'Bài viết thứ hai', content: 'Nội dung bài viết số 2.' },
            { id: '3', title: 'Bài viết thứ ba', content: 'Nội dung bài viết số 3.' },
        ];
    }

    render() {
        const postListHtml = this.posts.map(post => `
            <li>
                <a href="/posts/${post.id}" data-link>${post.title}</a>
            </li>
        `).join('');

        return `
            <h1>Danh sách bài viết</h1>
            <ul>
                ${postListHtml}
            </ul>
            <p>Quay lại <a href="/" data-link>Trang chủ</a>.</p>
        `;
    }

    attachEvents() {
        console.log('Post Index View: attachEvents called');
    }
}