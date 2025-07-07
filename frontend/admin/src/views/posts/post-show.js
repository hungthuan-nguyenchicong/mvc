// ./src/views/posts/post-show.js

class PostShow {
    constructor(params) {
        this.params = params;
    }

    render() {
        return /* html */ `
            <h1>Day la trang show id: ${this.params.id}</h1>
            <p>Day la trang chi tiet cua post cos id = ${this.params.id}</p>
        `;
    }
}

export default PostShow;