// src/templates/posts/post-detail.js
class PostDetail {
    constructor(params) {
        this.params = params; // Now you have access to { id: 'some-id' }
    }

    async render() {
        const postId = this.params.id;
        // In a real app, you'd fetch post data based on postId
        const postTitle = `Post ${postId}`;
        const postContent = `This is the content for post ID: ${postId}.`;

        return `
            <h1>${postTitle}</h1>
            <p>${postContent}</p>
            <a href="/" router>Go back to Home</a>
        `;
    }
}

export default PostDetail;