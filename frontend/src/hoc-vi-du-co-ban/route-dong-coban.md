## vi du route dong

// router.js

// Định nghĩa các route và nội dung tương ứng
const routes = {
    '/': {
        title: 'Trang Chủ',
        content: '<h1>Chào mừng đến với Trang Chủ!</h1><p>Đây là nội dung của trang chủ.</p>'
    },
    '/about': {
        title: 'Về Chúng Tôi',
        content: '<h1>Về Chúng Tôi</h1><p>Chúng tôi là một đội ngũ đam mê công nghệ.</p>'
    },
    '/contact': {
        title: 'Liên Hệ',
        content: '<h1>Liên Hệ Với Chúng Tôi</h1><p>Bạn có thể liên hệ với chúng tôi qua email: example@email.com</p>'
    },
    '/products': {
        title: 'Sản Phẩm',
        content: '<h1>Các Sản Phẩm Của Chúng Tôi</h1><p>Khám phá các sản phẩm độc đáo của chúng tôi.</p>'
    },
    // Route động cho chi tiết sản phẩm
    '/products/{id}': {
        title: 'Chi Tiết Sản Phẩm', // Tiêu đề sẽ được cập nhật động sau
        content: '<h1>Chi Tiết Sản Phẩm</h1><p>Đang tải chi tiết sản phẩm...</p>' // Nội dung sẽ được cập nhật động sau
    },
    '/product-create': {
        title: 'Tạo Sản Phẩm Mới',
        content: '<h1>Tạo Sản Phẩm Mới</h1><p>Form tạo sản phẩm sẽ ở đây.</p>'
    },
    '/category-products': {
        title: 'Sản Phẩm Theo Danh Mục',
        content: '<h1>Sản Phẩm Theo Danh Mục</h1><p>Danh sách sản phẩm theo danh mục cụ thể.</p>'
    },
    '/404': {
        title: 'Không Tìm Thấy Trang',
        content: '<h1>404 - Trang Không Tồn Tại</h1><p>Rất tiếc, trang bạn tìm kiếm không có ở đây.</p>'
    }
};

// Hàm xử lý khi URL thay đổi
const router = async () => {
    // Lấy đường dẫn hiện tại (ví dụ: "/about", "/products/123")
    const path = window.location.pathname;

    let match = null;
    let params = {}; // Khởi tạo params để lưu trữ các tham số động

    // Tìm kiếm route phù hợp
    for (const routePath in routes) {
        // Chuyển đổi routePath thành RegExp để khớp với các route động
        const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9_]+)}/g, '(?<$1>[a-zA-Z0-9_]+)')}$`);
        const potentialMatch = path.match(routeRegex);

        if (potentialMatch) {
            match = routes[routePath];
            // Trích xuất các tham số động
            params = potentialMatch.groups || {};
            break; // Tìm thấy route phù hợp, thoát vòng lặp
        }
    }

    // Nếu không tìm thấy route phù hợp, chuyển hướng đến trang 404
    if (!match) {
        match = routes['/404'];
    }

    // Lấy phần tử chính để hiển thị nội dung
    const appDiv = document.getElementById('app');

    // Cập nhật tiêu đề trang
    let pageTitle = match.title;
    let pageContent = match.content;

    // Xử lý route động nếu có
    if (match === routes['/products/{id}'] && params.id) {
        pageTitle = `Chi Tiết Sản Phẩm cho ID: ${params.id}`;
        pageContent = `<h1>Chi Tiết Sản Phẩm cho ID: ${params.id}</h1><p>Thông tin chi tiết về sản phẩm ${params.id} sẽ hiển thị ở đây.</p><p>Ví dụ: Tên sản phẩm, mô tả, giá cả...</p>`;
    }

    document.title = pageTitle;
    // Cập nhật nội dung trang
    appDiv.innerHTML = pageContent;
};

// Lắng nghe sự kiện click trên các liên kết để điều hướng mà không tải lại trang
document.addEventListener('click', e => {
    // Chỉ xử lý các liên kết nội bộ
    if (e.target.matches('[data-link]')) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        // Thêm trạng thái vào lịch sử trình duyệt để thay đổi URL
        window.history.pushState(null, '', e.target.href);
        router(); // Gọi router để cập nhật nội dung
    }
});

// Lắng nghe sự kiện thay đổi lịch sử trình duyệt (ví dụ: nhấn nút quay lại/tiến lên)
window.addEventListener('popstate', router);

// Lần đầu tải trang, chạy router để hiển thị nội dung ban đầu
//document.addEventListener('DOMContentLoaded', router);
export const init = () => {
    router();
}

## tham kharo


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

## tham khao 2

// router.js

// Định nghĩa các route và nội dung tương ứng
const routes = {
    '/': {
        title: 'Trang Chủ',
        content: '<h1>Chào mừng đến với Trang Chủ!</h1><p>Đây là nội dung của trang chủ.</p>'
    },
    '/about': {
        title: 'Về Chúng Tôi',
        content: '<h1>Về Chúng Tôi</h1><p>Chúng tôi là một đội ngũ đam mê công nghệ.</p>'
    },
    '/contact': {
        title: 'Liên Hệ',
        content: '<h1>Liên Hệ Với Chúng Tôi</h1><p>Bạn có thể liên hệ với chúng tôi qua email: example@email.com</p>'
    },
    '/products': {
        title: 'Sản Phẩm',
        content: '<h1>Các Sản Phẩm Của Chúng Tôi</h1><p>Khám phá các sản phẩm độc đáo của chúng tôi.</p>'
    },
    // Route động cho chi tiết sản phẩm
    '/products/{id}': {
        title: 'Chi Tiết Sản Phẩm',
        // Thêm một hàm để tạo nội dung động
        getContent: (params) => {
            const productId = params.id;
            return `
                <h1>Chi Tiết Sản Phẩm #${productId}</h1>
                <p>Đây là trang chi tiết cho sản phẩm có ID: <strong>${productId}</strong>.</p>
                <p>Bạn có thể tải dữ liệu sản phẩm từ API ở đây và hiển thị chi tiết.</p>
            `;
        }
    },
    '/edit/{id}': {
        title: 'Chỉnh Sửa Mục',
        getContent: (params) => {
            const itemId = params.id;
            return `
                <h1>Chỉnh Sửa Mục #${itemId}</h1>
                <p>Đây là trang chỉnh sửa cho mục có ID: <strong>${itemId}</strong>.</p>
                <p>Bạn có thể tải dữ liệu để điền vào form chỉnh sửa.</p>
            `;
        }
    },
    '/category/{id}': {
        title: 'Sản Phẩm Theo Danh Mục',
        getContent: (params) => {
            const categoryId = params.id;
            return `
                <h1>Sản Phẩm Theo Danh Mục #${categoryId}</h1>
                <p>Đây là danh sách sản phẩm thuộc danh mục có ID: <strong>${categoryId}</strong>.</p>
                <p>Tải và hiển thị các sản phẩm của danh mục này.</p>
            `;
        }
    },
    '/product-create': {
        title: 'Tạo Sản Phẩm Mới',
        content: '<h1>Tạo Sản Phẩm Mới</h1><p>Form tạo sản phẩm sẽ ở đây.</p>'
    },
    '/category-products': { // Có vẻ trùng lặp với '/category/{id}' nếu bạn muốn dynamic categories
        title: 'Sản Phẩm Theo Danh Mục',
        content: '<h1>Sản Phẩm Theo Danh Mục</h1><p>Danh sách sản phẩm theo danh mục cụ thể.</p>'
    },
    '/404': {
        title: 'Không Tìm Thấy Trang',
        content: '<h1>404 - Trang Không Tồn Tại</h1><p>Rất tiếc, trang bạn tìm kiếm không có ở đây.</p>'
    }
};

export const renderContent = (path) => {
    let params = {};
    let matchedRouteKey = null; // Lưu trữ key của route đã match
    let match = null;

    // Tìm route phù hợp
    for (const routePath in routes) {
        const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9_]+)}/g, '(?<$1>[a-zA-Z0-9_]+)')}$`);
        const potentialMatch = path.match(routeRegex);

        if (potentialMatch) {
            matchedRouteKey = routePath;
            match = routes[routePath];
            params = potentialMatch.groups || {};
            break;
        }
    }

    if (!match) {
        matchedRouteKey = '/404';
        match = routes['/404'];
    }

    let pageTitle = match.title;
    let pageContent = match.content;

    // Xử lý nội dung động nếu route có thuộc tính `getContent`
    if (typeof match.getContent === 'function') {
        pageContent = match.getContent(params);
        // Bạn có thể tùy chỉnh tiêu đề động ở đây nếu cần
        // Ví dụ: if (matchedRouteKey === '/products/{id}') pageTitle = `Chi Tiết Sản Phẩm #${params.id}`;
        // Hoặc để hàm getContent trả về cả tiêu đề và nội dung nếu phức tạp
    }


    const appTitle = document.querySelector('title');
    const contentElement = document.querySelector('.main-content');

    if (!contentElement) {
        console.error("Element with class 'main-content' not found.");
        return;
    }

    appTitle.textContent = pageTitle;
    contentElement.innerHTML = pageContent;
}

export const router = () => {
    let currentPath = window.location.pathname;
    renderContent(currentPath);
};

export const init = () => {
    router();
};