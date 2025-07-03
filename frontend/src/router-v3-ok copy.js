// router.js

const parseUrlParams = (path, routePath) => {
    const pathParts = path.split('/').filter(p => p);
    const routeParts = routePath.split('/').filter(p => p); // Đổi tên biến để rõ ràng hơn

    const params = {};

    // Kiểm tra độ dài: nếu số lượng phần tử không khớp, chắc chắn không khớp
    // Trừ khi một trong số đó là root path '/'
    if (pathParts.length !== routeParts.length && !(path === '/' && routePath === '/')) {
        return null;
    }

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            const paramName = routeParts[i].substring(1);
            params[paramName] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
            // Không khớp nếu phần tử không phải tham số động VÀ khác nhau
            return null;
        }
    }
    return params;
};

// cap nhat routes
const routes = {
    '/': {
        title: 'Home',
        content: '<h1>Home Page Content</h1>'
    },
    '/about': {
        title: 'About',
        content: '<h1>About Us</h1>'
    },
    '/contact': {
        title: 'Contact',
        content: '<h1> Contact Us</h1>'
    },
    '/products': {
        title: 'Product',
        content: '<h1>Our Products</h1>'
    },
    '/products/:id': {
        title: (params) => `Product Details for ID: ${params.id}`, // Đổi về chuỗi trực tiếp để tránh h1 lồng h1
        content: (params) => `<h1>Product Details for ID: ${params.id}</h1><p>More details about product ${params.id} will go here.</p>`
    },
    '/product-create': {
        title: 'Create Product',
        content: '<h1>Create New Product</h1>'
    },
    '/category-products': {
        title: 'Category Product',
        content: '<h1>Category Product</h1>'
    },
    '/404': {
        title: 'Page Not Found',
        content: '<h1>404 - Page Not Found</h1>'
    }
};

export const renderContent = (path) => {
    let page = null;
    let params = {};
    let matchedRoutePath = null; // Biến để lưu đường dẫn route khớp

    // 1. Ưu tiên tìm kiếm các route cố định khớp chính xác
    if (routes[path]) {
        page = routes[path];
        matchedRoutePath = path;
    } else {
        // 2. Nếu không tìm thấy route cố định, tìm kiếm các route có tham số động
        // Chuyển đổi routes thành mảng để sắp xếp và ưu tiên
        const routeKeys = Object.keys(routes);
        // Sắp xếp để ưu tiên các route có tham số động dài hơn hoặc cụ thể hơn nếu cần,
        // nhưng với logic parseUrlParams hiện tại, duyệt qua là đủ.
        // Có thể đảo ngược thứ tự duyệt để ưu tiên route động dài hơn nếu bạn có /product/:id và /product/:id/details
        // Tuy nhiên, với set route hiện tại, không quá cần thiết.
        
        for (const routePath in routes) {
            if (routePath.includes(':')) {
                const parsedParams = parseUrlParams(path, routePath);
                if (parsedParams) {
                    page = routes[routePath];
                    params = parsedParams;
                    matchedRoutePath = routePath;
                    break; // Tìm thấy route động khớp, thoát vòng lặp
                }
            }
        }
    }

    // Nếu không tìm thấy trang nào, chuyển hướng đến trang 404
    if (!page) {
        page = routes['/404'];
        matchedRoutePath = '/404'; // Cập nhật đường dẫn khớp để hiển thị trong debug nếu cần
    }

    const appTitle = document.querySelector('title');
    const contentElement = document.querySelector('.main-content');

    if (!contentElement) {
        console.error("Element with class 'main-content' not found.");
        return;
    }

    // Render content
    contentElement.innerHTML = typeof page.content === 'function' ? page.content(params) : page.content;

    // Set title
    // Đảm bảo rằng title không chứa các thẻ HTML như h1 nếu nó được dùng trong <title> của tài liệu
    const baseTitle = typeof page.title === 'function' ? page.title(params) : (page.title || 'My SPA');
    appTitle.textContent = `${baseTitle} | My SPA`;
};

export const router = () => {
    let currentPath = window.location.pathname;
    renderContent(currentPath);
};

export const init = () => {
    router();
};