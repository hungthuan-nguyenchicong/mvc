class Router {
    constructor() {
        this.routes = {};
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    matchRoute(path) {
        const handler = this.routes[path];
        if (handler) {
            handler();
        } else {
            // Xử lý 404 hoặc chuyển hướng về trang chủ
            console.warn(`No route found for ${path}. Redirecting to home.`);
            this.routes['/'](); // Chuyển hướng về trang chủ
        }
    }
}

export default Router;