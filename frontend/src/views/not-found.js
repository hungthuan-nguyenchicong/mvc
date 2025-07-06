// ./src/views/not-found.js

class NotFound {
    constructor() {
        this.init();
    }

    render() {
        return /* html */ `
            <h1>Trang 404 Not Found</h1>
            <p>Quay ve trang chu <a href="/" route>Quay ve trang chu</a></p>
        `;
    }

    init() {
        document.title = 'Trang 404 Not Found!';
    }
}

export default NotFound;