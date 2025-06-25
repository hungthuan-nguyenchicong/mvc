// src/views/posts/PostIndex.js

export class PostIndex {
    constructor() {
        this.postIndexElement = null;
    }

    render() {
        this.postIndexElement = document.createElement('div');
        this.postIndexElement.classList.add('post-index');
        this.postIndexElement.innerHTML = /* html */ `
            <h1>Post Index render</h1>
        `;
    }
}