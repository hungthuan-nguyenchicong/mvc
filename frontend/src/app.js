import HomePage from './pages/home';
import AboutPage from './pages/about';
import Router from './router'; // Sẽ tạo file này sau

class App {
    constructor(container) {
        this.container = container;
        this.router = new Router();
        this.routes = {
            '/': HomePage,
            '/about': AboutPage,
        };
    }

    init() {
        this.router.addRoute('/', () => this.renderPage(new HomePage()));
        this.router.addRoute('/about', () => this.renderPage(new AboutPage()));

        // Xử lý khi URL thay đổi (ví dụ: click vào link, sử dụng history API)
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        // Xử lý click trên các liên kết để tránh tải lại trang
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('a') && e.target.getAttribute('href').startsWith('/')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Khởi tạo trang đầu tiên dựa trên URL hiện tại
        this.navigate(window.location.pathname);
    }

    navigate(path) {
        if (window.location.pathname !== path) {
            history.pushState({}, '', path);
        }
        this.router.matchRoute(path);
    }

    renderPage(pageInstance) {
        this.container.innerHTML = ''; // Xóa nội dung cũ
        this.container.appendChild(pageInstance.render());
        pageInstance.afterRender && pageInstance.afterRender(); // Gọi hàm afterRender nếu có
    }
}

export default App;