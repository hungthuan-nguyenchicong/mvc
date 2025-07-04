// ./router.js

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
}
// div.main-content
//const contentElement = document.querySelector('.main-content');
const appTitle = document.querySelector('title'); // lay title cua tai lieu

export const renderContent = (path) => {
    // sau khi domcontent loaded
    const contentElement = document.querySelector('.main-content');
    if (!contentElement) {
        return;
    }
    const page = routes[path] || routes['/404'];
    contentElement.innerHTML = page.content;
    appTitle.textContent = page.title ? `${page.title}` : 'My SPA'; // tieu de trang
}

// router
export const router = () => {
    let currentPath = window.location.pathname;
    
    // chuyen huong neu trang khong co trong routes
    if (!routes[currentPath]) {
        window.history.replaceState(null,null,'/404');
        currentPath = '/404'; // 
    }
    
    renderContent(currentPath);

    // phat ra su kin routeChange
    const routeChangeEvent = new CustomEvent('routeChange', {
        detail: {
            path: currentPath
        }
    })
    document.dispatchEvent(routeChangeEvent);
}

// click link
export const setupRouterListeners = () => {
    document.addEventListener('click', (e)=>{
        const routeLink = e.target.closest('a[route]');
        if (routeLink) {
            e.preventDefault();
            // const path
            const path = e.target.getAttribute('href');
            if (window.location.pathname !== path) {
                window.history.pushState(null,null,path);
            }
            router();
        }
    })
    // Xử lý quay lại/tiến lên của trình duyệt
    window.addEventListener('popstate',()=>{
        router();
    })
}

// set up active linh listener routeChange
export const setupActiveLinkListener = () => {
    // lang nghe routeChang
    document.addEventListener('routeChange', (e)=>{
        const {path} = e.detail;
        document.querySelectorAll('a[route]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        })
    })
}

// init
export const init = () => {
    // THAY ĐỔI THỨ TỰ GỌI CÁC HÀM TẠI ĐÂY
    setupActiveLinkListener(); // 1. Thiết lập trình lắng nghe active link TRƯỚC TIÊN
    setupRouterListeners();    // 2. Thiết lập trình lắng nghe click link/popstate
    router();                  // 3. Chạy router lần đầu (sẽ dispatch routeChange)
}