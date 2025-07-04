// router.js

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
    '/products/{id}': (params) => {
        return {
            title: `Chi tiết sản phẩm ${params.id}`,
            content: `<h1>Sản phẩm có id: ${params.id}</h1><p>Chi tiết sản phẩm có id là: ${params.id}</p>`
        }
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
}
export const renderContent = (path)=>{
    let pageTitle = '';
    let pageContent = '';
    let matchResult = null;
    let params = {};

    // tìm route động

    for (const routePath in routes) {
        // chuyển đổi routePath thành RegExp để khớp với route động
        const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
        const potentialMatch = path.match(routeRegex);
        if (potentialMatch) {
            // if the route itself is a function, call it to get the route details
            if (typeof routes[routePath] === 'function') {
                params = potentialMatch.groups || {};
                matchResult = routes[routePath](params);// call the function to get title and content
            } else {
                matchResult = routes[routePath]; // Assign the static route object
            }
            break;
        }
        
    }

    //matchResult = routes[path];
    //console.log(matchResult)


    // nếu không tìm thấy trang phù hợp chuyển trang 404
    if (!matchResult) {
        matchResult = routes['/404'];
    }
    pageTitle = matchResult.title;
    pageContent = matchResult.content;

    // app title & contentElement
    const appTitle = document.querySelector('title');
    const mainContentElement = document.querySelector('.main-content');
    
    if (!mainContentElement) {
        console.error('Element with class main-content not found');
        return;
    }
    appTitle.textContent = pageTitle;
    mainContentElement.innerHTML = pageContent;
}

export const router = ()=>{
    const currentPath = window.location.pathname;
    renderContent(currentPath);
    // phat ra su kien routeChange
    const routeChangeEvent = new CustomEvent('routeChange', {
        detail: {
            path: currentPath
        }
    });
    document.dispatchEvent(routeChangeEvent);
}

// click link
export const setupRouterListeners = ()=>{
    // click a route
    document.addEventListener('click', (e)=>{
        const routeLink = e.target.closest('a[route]');
        if (routeLink) {
            e.preventDefault();
            // path
            const path = e.target.getAttribute('href');
            if (window.location.pathname !== path) {
                window.history.pushState(null,null,path);
            }
            router();
        }
    })
    // xử lý quay lại/ tiến lên của trình duyệt
    window.addEventListener('popstate', ()=>{
        router();
    })
}

// setup Activlink a route
export const setupActiveLinkListener = ()=>{
    // lăng nghe routeChange;
    document.addEventListener('routeChange', (e)=>{
        const {path} = e.detail;
        // add class active
        document.querySelectorAll('a[route]').forEach(link =>{
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        })
    })
}

export const init = ()=>{
    setupActiveLinkListener();
    setupRouterListeners();
    router();
}