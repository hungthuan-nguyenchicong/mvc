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
    '/products/{id}': (params) => { // This is now a function that returns an object
        return {
            title: `Chi Tiết Sản Phẩm: ${params.id}`, // Dynamic title
            content: `
                <h1>Sản Phẩm Theo Danh Mục #${params.id}</h1>
                <p>Đây là danh sách sản phẩm thuộc danh mục có ID: <strong>${params.id}</strong>.</p>
                <p>Tải và hiển thị các sản phẩm của danh mục này.</p>
            `
        };
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

export const renderContent = (path) => {
    let params = {};
    let matchResult = null; // Changed from 'match' to avoid confusion with potentialMatch
    let pageTitle = '';
    let pageContent = '';

    // tim route phu hop
    for (const routePath in routes) {
        // chuyen doi routePath thanh RegExp de khop voi route dong
        const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9_]+)}/g, '(?<$1>[a-zA-Z0-9_]+)')}$`);
        const potentialMatch = path.match(routeRegex);

        if (potentialMatch) {
            // If the route itself is a function, call it to get the route details
            if (typeof routes[routePath] === 'function') {
                params = potentialMatch.groups || {};
                matchResult = routes[routePath](params); // Call the function to get title and content
            } else {
                matchResult = routes[routePath]; // Assign the static route object
            }
            break;
        }
    }

    // neu khong tim thay route phu hop, chuyen huong den trang 404
    if (!matchResult) {
        matchResult = routes['/404'];
    }

    // Assign title and content based on the matchResult
    pageTitle = matchResult.title;
    pageContent = matchResult.content;
    
    const appTitle = document.querySelector('title');
    const contentElement = document.querySelector('.main-content');

    if (!contentElement) {
        console.error("Element with class 'main-content' not found.");
        return;
    }

    // render content
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