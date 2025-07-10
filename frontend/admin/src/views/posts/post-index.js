// ./src/views/home.js

class PostIndex {
    constructor() {
        this.init();
    }

    render() {
        return /* html */ `
            <h1>Trang Post Index</h1>
            <p>Day la trang Post Index</p>
        `;
    }

    init() {
        document.title = 'Trang chu Post';
    }
}

export default PostIndex;