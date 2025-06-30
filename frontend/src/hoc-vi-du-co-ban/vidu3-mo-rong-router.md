## học mở rộng ví dụ

Tôi có thể giúp bạn mở rộng ví dụ về Vanilla JS SPA Router này. Dưới đây là một số ý tưởng và cách triển khai để làm cho ứng dụng của bạn mạnh mẽ và có cấu trúc hơn:

1. Tách các thành phần Router ra File riêng
Việc tách router logic ra một file riêng sẽ giúp code của bạn dễ quản lý hơn.

router.js:

JavaScript

// router.js

const routes = {
    '/': {
        content: '<h1>Home Page Content</h1>',
        title: 'Home'
    },
    '/about': {
        content: '<h1>About Us</h1><p>Learn more about us.</p>',
        title: 'About'
    },
    '/contact': {
        content: '<h1>Contact Us</h1><p>Get in touch!</p>',
        title: 'Contact'
    },
    '/products': {
        content: '<h1>Our Products</h1><p>Explore our wide range of products.</p>',
        title: 'Products'
    },
    '/products-create': {
        content: '<h1>Create New Product</h1><p>Add details for a new product.</p>',
        title: 'Create Product'
    },
    '/category-products': {
        content: '<h1>Category Products</h1><p>Products grouped by category.</p>',
        title: 'Category Products'
    },
    '/404': {
        content: '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>',
        title: 'Page Not Found'
    }
};

const contentElement = document.querySelector('.main-content');
const appTitle = document.querySelector('title'); // Lấy thẻ title của tài liệu

export const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    contentElement.innerHTML = page.content;
    appTitle.textContent = page.title ? `${page.title} | My SPA` : 'My SPA'; // Cập nhật tiêu đề trang
};

export const router = () => {
    let currentPath = window.location.pathname;

    // Chuyển hướng nếu URL không có trong routes
    if (!routes[currentPath]) {
        window.history.replaceState(null, null, '/404');
        currentPath = '/404'; // Cập nhật currentPath để render trang 404
    }

    renderContent(currentPath);

    // Phát ra sự kiện routeChange
    const routeChangeEvent = new CustomEvent('routeChange', {
        detail: {
            path: currentPath
        }
    });
    document.dispatchEvent(routeChangeEvent);
};

export const setupRouterListeners = () => {
    // Xử lý click link route
    document.addEventListener('click', (e) => {
        const routeLink = e.target.closest('a[route]');
        if (routeLink) {
            e.preventDefault();
            const path = e.target.getAttribute('href');

            if (window.location.pathname !== path) {
                window.history.pushState(null, null, path);
            }
            router();
        }
    });

    // Xử lý quay lại/tiến lên của trình duyệt
    window.addEventListener('popstate', () => {
        router();
    });
};

export const setupNavActiveLinkListener = () => {
    document.addEventListener('routeChange', (e) => {
        const {
            path
        } = e.detail;
        document.querySelectorAll('a[route]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    });
};
main.js (hoặc app.js):

JavaScript

import './main.scss';
import './hoc-vi-du-co-ban/nav.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/sidebar.scss';
import './hoc-vi-du-co-ban/main-content.scss';

import {
    router,
    setupRouterListeners,
    setupNavActiveLinkListener
} from './router.js'; // Import từ file router.js

// app
const app = document.getElementById('app');

// add nav
const navElement = document.createElement('nav');
app.appendChild(navElement);
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/about" route>About</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <li><a href="/test" route>Test 404</a></li>
        <li><a href="/noroute" route>No Route (404)</a></li>
    </ul>
`;

// main content
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// add sidebar
const sidebarElement = document.createElement('aside');
mainContent.appendChild(sidebarElement);

// add contentElement
const contentElement = document.createElement('div');
contentElement.classList.add('main-content');
mainContent.appendChild(contentElement);

// render sidebar
sidebarElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <hr>
        <li><a href="/products" route>All Products</a></li>
        <li><a href="/products-create" route>Create Product</a></li>
        <li><a href="/category-products" route>Category Products</a></li>
    </ul>
`;

document.addEventListener('DOMContentLoaded', () => {
    setupRouterListeners(); // Khởi tạo lắng nghe sự kiện của router
    setupNavActiveLinkListener(); // Khởi tạo lắng nghe sự kiện active link
    router(); // Chạy router lần đầu khi tải trang
});
2. Dynamic Route Parameters (Tham số động)
Bạn có thể muốn hiển thị thông tin chi tiết của một sản phẩm dựa trên ID của nó (ví dụ: /products/123).

router.js (cập nhật)

JavaScript

// Thêm hàm để parse các tham số động từ URL
const parseUrlParams = (path, routePath) => {
    const pathParts = path.split('/').filter(p => p);
    const routeParts = routePath.split('/').filter(p => p);
    const params = {};

    if (pathParts.length !== routeParts.length) {
        return null; // Không khớp nếu số lượng phần tử khác nhau
    }

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            const paramName = routeParts[i].substring(1);
            params[paramName] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
            return null; // Không khớp nếu phần tử không phải tham số và khác nhau
        }
    }
    return params;
};

// Cập nhật routes để hỗ trợ tham số động
const routes = {
    '/': { /* ... */ },
    // ... các routes khác
    '/products/:id': {
        content: (params) => `<h1>Product Details for ID: ${params.id}</h1><p>More details about product ${params.id} will go here.</p>`,
        title: (params) => `Product ${params.id}`
    },
    '/products': { /* ... */ },
    // ... các routes khác
    '/404': { /* ... */ }
};

export const renderContent = (path) => {
    let page = null;
    let params = {};

    // Tìm kiếm route khớp, ưu tiên các route có tham số động
    for (const routePath in routes) {
        if (routePath.includes(':')) {
            const parsedParams = parseUrlParams(path, routePath);
            if (parsedParams) {
                page = routes[routePath];
                params = parsedParams;
                break;
            }
        } else if (routePath === path) {
            page = routes[path];
            break;
        }
    }

    if (!page) {
        page = routes['/404'];
        path = '/404'; // Đảm bảo rằng 404 được xử lý đúng
    }

    // Kiểm tra nếu content hoặc title là hàm, thì gọi với params
    contentElement.innerHTML = typeof page.content === 'function' ? page.content(params) : page.content;
    appTitle.textContent = typeof page.title === 'function' ? `${page.title(params)} | My SPA` : `${page.title || 'My SPA'} | My SPA`;
};

// ... giữ nguyên router, setupRouterListeners, setupNavActiveLinkListener
main.js (cập nhật nav/sidebar để thêm link ví dụ)

JavaScript

// ...
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/about" route>About</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <li><a href="/products/123" route>Product 123</a></li>
        <li><a href="/products/456" route>Product 456</a></li>
        <li><a href="/test" route>Test 404</a></li>
        <li><a href="/noroute" route>No Route (404)</a></li>
    </ul>
`;
// ...
sidebarElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <hr>
        <li><a href="/products" route>All Products</a></li>
        <li><a href="/products-create" route>Create Product</a></li>
        <li><a href="/products/789" route>Specific Product (789)</a></li>
        <li><a href="/category-products" route>Category Products</a></li>
    </ul>
`;
// ...
3. Thêm State Management đơn giản
Đối với các ứng dụng SPA, việc quản lý trạng thái (state) là rất quan trọng. Bạn có thể thêm một Store đơn giản.

store.js

JavaScript

// store.js
const state = {
    products: [],
    user: null,
    loading: false
};

const listeners = [];

export const getState = () => ({
    ...state
}); // Trả về bản sao để tránh thay đổi trực tiếp

export const dispatch = (action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            state.products = action.payload;
            break;
        case 'SET_USER':
            state.user = action.payload;
            break;
        case 'SET_LOADING':
            state.loading = action.payload;
            break;
            // Thêm các action khác nếu cần
        default:
            console.warn(`Action type "${action.type}" not recognized.`);
            return;
    }
    // Thông báo cho tất cả các listener rằng state đã thay đổi
    listeners.forEach(listener => listener(state));
};

export const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
        // Hàm unsubscribe
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};
router.js (ví dụ tích hợp store)

JavaScript

// Import store
import {
    getState,
    dispatch,
    subscribe
} from './store.js';

// ...
const routes = {
    // ...
    '/products': {
        content: () => {
            const {
                products,
                loading
            } = getState();
            if (loading) return '<p>Loading products...</p>';
            if (products.length === 0) return '<p>No products found. <button id="load-products-btn">Load Products</button></p>';
            return `
                <h1>Our Products</h1>
                <ul>
                    ${products.map(product => `<li>${product.name} (ID: ${product.id})</li>`).join('')}
                </ul>
                <button id="refresh-products-btn">Refresh Products</button>
            `;
        },
        title: 'Products',
        onEnter: async () => { // Hàm được gọi khi vào route này
            if (getState().products.length === 0) {
                dispatch({
                    type: 'SET_LOADING',
                    payload: true
                });
                // Giả lập gọi API
                await new Promise(resolve => setTimeout(resolve, 1000));
                const fetchedProducts = [{
                    id: 1,
                    name: 'Product A'
                }, {
                    id: 2,
                    name: 'Product B'
                }];
                dispatch({
                    type: 'SET_PRODUCTS',
                    payload: fetchedProducts
                });
                dispatch({
                    type: 'SET_LOADING',
                    payload: false
                });
            }
        },
        onLeave: () => {
            // Có thể làm sạch dữ liệu hoặc hủy các subscription tại đây
            console.log('Leaving products page');
        }
    },
    // ...
};


// Cập nhật renderContent để xử lý onEnter/onLeave và cập nhật lại nội dung khi state thay đổi
let currentOnLeave = null;

export const renderContent = (path) => {
    if (currentOnLeave && typeof currentOnLeave === 'function') {
        currentOnLeave(); // Gọi hàm onLeave của route cũ
    }

    let page = null;
    let params = {};
    let matchedRoutePath = null; // Để lưu lại path thực sự khớp

    for (const routePath in routes) {
        if (routePath.includes(':')) {
            const parsedParams = parseUrlParams(path, routePath);
            if (parsedParams) {
                page = routes[routePath];
                params = parsedParams;
                matchedRoutePath = routePath;
                break;
            }
        } else if (routePath === path) {
            page = routes[path];
            matchedRoutePath = path;
            break;
        }
    }

    if (!page) {
        page = routes['/404'];
        matchedRoutePath = '/404';
    }

    // Lấy nội dung ban đầu
    contentElement.innerHTML = typeof page.content === 'function' ? page.content(params) : page.content;
    appTitle.textContent = typeof page.title === 'function' ? `${page.title(params)} | My SPA` : `${page.title || 'My SPA'} | My SPA`;

    // Gọi onEnter nếu có
    if (page.onEnter && typeof page.onEnter === 'function') {
        page.onEnter(params);
    }
    currentOnLeave = page.onLeave; // Lưu hàm onLeave cho lần chuyển route tiếp theo

    // Đăng ký lắng nghe store để cập nhật nội dung
    const unsubscribe = subscribe(newState => {
        // Chỉ cập nhật nếu route hiện tại là route mà chúng ta đang lắng nghe
        // Hoặc nếu sự thay đổi state ảnh hưởng đến nhiều route
        // Tùy thuộc vào logic của bạn
        if (window.location.pathname === matchedRoutePath || (matchedRoutePath.includes(':') && parseUrlParams(window.location.pathname, matchedRoutePath))) {
             contentElement.innerHTML = typeof page.content === 'function' ? page.content(params) : page.content;
             attachProductPageListeners(); // Gắn lại listeners nếu nội dung được render lại
        }
    });

    // Cần một cơ chế để hủy subscribe khi rời khỏi trang
    // Hoặc chỉ subscribe một lần và render lại toàn bộ trang khi state thay đổi
    // Để đơn giản, ví dụ này sẽ render lại khi có thay đổi state
};


// Thêm hàm để gắn các event listener cho trang products
const attachProductPageListeners = () => {
    const loadBtn = document.getElementById('load-products-btn');
    if (loadBtn) {
        loadBtn.onclick = async () => {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fetchedProducts = [{
                id: 1,
                name: 'Product Alpha'
            }, {
                id: 2,
                name: 'Product Beta'
            }, {
                id: 3,
                name: 'Product Gamma'
            }];
            dispatch({
                type: 'SET_PRODUCTS',
                payload: fetchedProducts
            });
            dispatch({
                type: 'SET_LOADING',
                payload: false
            });
        };
    }
    const refreshBtn = document.getElementById('refresh-products-btn');
    if (refreshBtn) {
        refreshBtn.onclick = () => {
            dispatch({ type: 'SET_PRODUCTS', payload: [] }); // Xóa sản phẩm để load lại
            router(); // Kích hoạt router để gọi lại onEnter
        };
    }
};

// ... trong router function, gọi attachProductPageListeners sau khi render
export const router = () => {
    let currentPath = window.location.pathname;

    if (!routes[currentPath] && !Object.keys(routes).some(routePath => routePath.includes(':') && parseUrlParams(currentPath, routePath))) {
        window.history.replaceState(null, null, '/404');
        currentPath = '/404';
    }

    renderContent(currentPath);
    attachProductPageListeners(); // Đảm bảo các listener được gắn lại sau mỗi lần render
    // Phát ra sự kiện routeChange
    const routeChangeEvent = new CustomEvent('routeChange', {
        detail: {
            path: currentPath
        }
    });
    document.dispatchEvent(routeChangeEvent);
};
main.js (không cần thay đổi nhiều, chỉ cần import store nếu cần dùng trực tiếp)

4. Loading Indicators (Hiển thị trạng thái tải)
Khi chuyển trang hoặc tải dữ liệu, bạn nên hiển thị một indicator.

main.js (hoặc file xử lý UI chung)

JavaScript

// ... trong main.js
import {
    router,
    setupRouterListeners,
    setupNavActiveLinkListener,
    renderContent // Cần renderContent để cập nhật nội dung
} from './router.js';
import {
    subscribe,
    getState
} from './store.js'; // Import store

// ... (các phần tạo nav, main, sidebar, contentElement)

// Thêm một loading overlay hoặc indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loading-indicator';
loadingIndicator.textContent = 'Loading...';
app.appendChild(loadingIndicator); // Hoặc một vị trí phù hợp hơn trong layout của bạn

// CSS cho loading-indicator (ví dụ trong main.scss)
/*
#loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    z-index: 1000;
    visibility: hidden; // Mặc định ẩn
    opacity: 0;
    transition: visibility 0s, opacity 0.3s linear;
}

#loading-indicator.visible {
    visibility: visible;
    opacity: 1;
}
*/

document.addEventListener('DOMContentLoaded', () => {
    setupRouterListeners();
    setupNavActiveLinkListener();

    // Lắng nghe sự kiện routeChange để hiển thị loading
    document.addEventListener('routeChange', () => {
        // Có thể hiển thị loading khi route bắt đầu thay đổi
        // Tùy thuộc vào cách bạn quản lý loading trong onEnter của route
    });

    // Lắng nghe store để cập nhật trạng thái loading
    subscribe(newState => {
        if (newState.loading) {
            loadingIndicator.classList.add('visible');
        } else {
            loadingIndicator.classList.remove('visible');
        }
    });

    router();
});
5. Thêm Error Handling
Xử lý lỗi cho các tác vụ không đồng bộ (ví dụ: gọi API).

store.js (cập nhật)

JavaScript

// store.js
const state = {
    products: [],
    user: null,
    loading: false,
    error: null // Thêm trường error
};

// ... (getState, subscribe)

export const dispatch = (action) => {
    switch (action.type) {
        // ... (các case khác)
        case 'SET_ERROR':
            state.error = action.payload;
            break;
        case 'CLEAR_ERROR':
            state.error = null;
            break;
        default:
            console.warn(`Action type "${action.type}" not recognized.`);
            return;
    }
    listeners.forEach(listener => listener(state));
};
router.js (cập nhật route products onEnter)

JavaScript

// ...
'/products': {
    content: () => {
        const {
            products,
            loading,
            error
        } = getState();
        if (loading) return '<p>Loading products...</p>';
        if (error) return `<p style="color: red;">Error: ${error}</p><button id="retry-products-btn">Retry</button>`;
        if (products.length === 0) return '<p>No products found. <button id="load-products-btn">Load Products</button></p>';
        return `
            <h1>Our Products</h1>
            <ul>
                ${products.map(product => `<li>${product.name} (ID: ${product.id})</li>`).join('')}
            </ul>
            <button id="refresh-products-btn">Refresh Products</button>
        `;
    },
    title: 'Products',
    onEnter: async () => {
        dispatch({
            type: 'CLEAR_ERROR'
        }); // Xóa lỗi cũ khi vào trang
        if (getState().products.length === 0) {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            try {
                // Giả lập gọi API có thể lỗi
                const response = await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (Math.random() > 0.8) { // 20% khả năng lỗi
                            reject("Failed to fetch products.");
                        } else {
                            resolve([{
                                id: 1,
                                name: 'Product A'
                            }, {
                                id: 2,
                                name: 'Product B'
                            }]);
                        }
                    }, 1000);
                });
                dispatch({
                    type: 'SET_PRODUCTS',
                    payload: response
                });
            } catch (err) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: err
                });
            } finally {
                dispatch({
                    type: 'SET_LOADING',
                    payload: false
                });
            }
        }
    },
    // ... onLeave
},
// ...

// Cập nhật attachProductPageListeners
const attachProductPageListeners = () => {
    // ...
    const retryBtn = document.getElementById('retry-products-btn');
    if (retryBtn) {
        retryBtn.onclick = () => {
            router(); // Kích hoạt router để gọi lại onEnter và thử lại
        };
    }
};
6. Thêm chức năng cho các Route khác
Bạn có thể mở rộng các route khác như Create Product hoặc Category Products để có các form hoặc logic riêng.

router.js (ví dụ)

JavaScript

// ...
'/products-create': {
    content: () => `
        <h1>Create New Product</h1>
        <form id="create-product-form">
            <label for="product-name">Product Name:</label>
            <input type="text" id="product-name" required><br><br>
            <label for="product-price">Price:</label>
            <input type="number" id="product-price" required><br><br>
            <button type="submit">Create Product</button>
        </form>
    `,
    title: 'Create Product',
    onEnter: () => {
        // Gắn listener cho form
        setTimeout(() => { // Đảm bảo form đã được render
            const form = document.getElementById('create-product-form');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const productName = document.getElementById('product-name').value;
                    const productPrice = document.getElementById('product-price').value;
                    console.log('New product:', {
                        name: productName,
                        price: productPrice
                    });
                    alert(`Product "${productName}" created! (Check console)`);
                    // Có thể dispatch một action để thêm sản phẩm vào store hoặc gọi API
                    // dispatch({ type: 'ADD_PRODUCT', payload: { name: productName, price: productPrice }});
                    window.history.pushState(null, null, '/products'); // Chuyển về trang sản phẩm
                    router();
                };
            }
        }, 0);
    },
    onLeave: () => {
        // Gỡ bỏ listener để tránh memory leak
        const form = document.getElementById('create-product-form');
        if (form) {
            form.onsubmit = null;
        }
    }
},
// ...
7. Sử dụng Async/Await cho các hàm onEnter
Giúp quản lý các tác vụ bất đồng bộ dễ dàng hơn.

Các ví dụ trên đã sử dụng async/await trong onEnter của route products.

Cấu trúc thư mục cuối cùng (gợi ý):
your-spa-project/
├── index.html
├── main.js
├── router.js
├── store.js
├── styles/
│   ├── main.scss
│   └── hoc-vi-du-co-ban/
│       ├── nav.scss
│       ├── main.scss
│       ├── sidebar.scss
│       └── main-content.scss
└── assets/
    └── images/
Với những mở rộng này, bạn đã có một cấu trúc SPA mạnh mẽ và có thể mở rộng hơn nữa bằng cách thêm các thành phần (components) nhỏ hơn, template engine, hoặc các thư viện quản lý state phức tạp hơn nếu cần.