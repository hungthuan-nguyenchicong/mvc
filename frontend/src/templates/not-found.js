// ./src/templates/404.js

class NotFound {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        return /* html */ `
            <h1>Trang 404 Not Found</h1>
            <p>Vui lòng quay lại trang chủ <a href="/" route>Quay về trang chủ</a></p>
        `;
    }
}

export default NotFound;