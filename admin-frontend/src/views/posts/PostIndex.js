// src/views/posts/PostIndex.js

export default class PostIndex { // Use 'export default class' for simplicity
    constructor() {
        console.log("PostIndex view constructed!");
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h1>All Posts</h1>
            <p>Content from PostIndex.js for path: /api/posts/post-index</p>
        `;
        return div;
    }

    // Optional init method if you need post-render setup
    init() {
        console.log("PostIndex view initialized.");
    }
}