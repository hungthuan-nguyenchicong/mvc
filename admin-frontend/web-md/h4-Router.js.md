# Router.js

Được rồi, hãy cập nhật Router.jsđể sử dụng routesmảng một cách chính xác, tải các thành phần chế độ xem một cách động và hiển thị chúng vào #contentdiv.

Những thay đổi chính bao gồm:

Truyền routesmảng cho Routerhàm tạo.

Sửa đổi renderContentlogic (chúng ta sẽ chuyển vào phương thức riêng tư _loadAndRenderViewtrong Routerlớp) thành:

Tìm đường dẫn hiện tại trong routesmảng.

import()Tệp xem tương ứng một cách động .

Khởi tạo thành phần chế độ xem và gọi render()phương thức của nó để lấy nội dung HTML.

Chèn mã HTML đó vào #contentdiv.

Thêm cách xử lý lỗi cơ bản cho việc nhập động.

Sau đây là thông tin cập nhật src/core/Router.js:

JavaScript

// src/core/Router.js

export class Router {
    constructor(routes) { // Accept routes array here
        this.routes = routes; // Store the routes array
        this.routeChangeListeners = [];
        console.log("Router.js: Router constructor called. Initializing with routes:", this.routes);
        this._setupListeners();
    }

    // Public method to register callbacks for route changes
    onRouteChange(callback) {
        if (typeof callback === 'function') {
            this.routeChangeListeners.push(callback);
        }
    }

    // Internal method to trigger all registered listeners
    #triggerRouteChange(path) {
        console.log("Router.js: #triggerRouteChange called with path:", path);
        this.routeChangeListeners.forEach(listener => {
            console.log("Router.js: Executing routeChange listener for path:", path);
            listener(path);
        });
    }

    // NEW PUBLIC METHOD to trigger the initial route manually
    triggerInitialRoute() {
        const initialPath = window.location.pathname;
        console.log("Router.js: triggerInitialRoute called. Initial path:", initialPath);
        this._loadAndRenderView(initialPath); // Call the new dynamic rendering method
        this.#triggerRouteChange(initialPath);
        console.log("Router.js: Initial route change triggered and listeners notified.");
    }

    // Private method to set up event listeners (popstate, click)
    _setupListeners() {
        console.log("Router.js: _setupListeners() method called.");

        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            console.log("Router.js: popstate event detected. Path:", currentPath);
            this._loadAndRenderView(currentPath); // Call the new dynamic rendering method
            this.#triggerRouteChange(currentPath);
        });
        console.log("Router.js: popstate listener attached.");

        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[data-link]');
            if (routeLink) {
                e.preventDefault();
                const path = routeLink.getAttribute('href');
                console.log("Router.js: Click on data-link detected. Href:", path);

                if (window.location.pathname === path) {
                    console.log("Router.js: Click on current path. Triggering route change for refresh.");
                    // Even if path is the same, re-render to ensure component state reset if needed
                    this._loadAndRenderView(path);
                    this.#triggerRouteChange(path);
                    return;
                }

                history.pushState(null, '', path);
                console.log("Router.js: Pushed new state to history. New path:", path);
                this._loadAndRenderView(path); // Call the new dynamic rendering method
                this.#triggerRouteChange(path);
            }
        });
        console.log("Router.js: data-link click listener attached.");
    }

    // NEW: Private method to load and render the view based on the current path
    async _loadAndRenderView(path) {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error("Router.js: No element with id 'content' found to render content.");
            return;
        }

        // Clear previous content
        contentDiv.innerHTML = '';
        contentDiv.textContent = 'Loading...'; // Show loading indicator

        const matchedRoute = this.routes.find(route => route.path === path);
        console.log("Router.js: Attempting to match path:", path, "Matched route:", matchedRoute);

        if (matchedRoute) {
            try {
                // Dynamically import the module
                // Assumes your view components are exported as default (e.g., export default class PostIndex {...})
                // or as a named export matching the 'view' property (e.g., export class PostIndex {...})
                // For simplicity and common practice, we'll assume default export and use 'module.default'.
                // If your views are named exports, you'd do: const ViewComponent = module[matchedRoute.view];
                const module = await import(matchedRoute.file);
                const ViewComponent = module.default || module[matchedRoute.view]; // Try default first, then named

                if (typeof ViewComponent === 'function' || typeof ViewComponent === 'object') { // Check if it's a class or object
                    const instance = new ViewComponent(); // Instantiate the component
                    if (typeof instance.render === 'function') {
                        const viewContent = instance.render(); // Assume component has a render method
                        contentDiv.innerHTML = ''; // Clear loading
                        contentDiv.appendChild(viewContent);
                        // If component has an 'init' or 'onMount' method, call it here
                        if (typeof instance.init === 'function') {
                            instance.init();
                        }
                    } else {
                        console.error(`Router.js: View component '${matchedRoute.view}' for path '${path}' does not have a render() method.`);
                        contentDiv.innerHTML = '<h1>Error: View component malformed.</h1><p>Please check the console for details.</p>';
                    }
                } else {
                    console.error(`Router.js: Imported view '${matchedRoute.view}' for path '${path}' is not a valid component (expected class or object).`, ViewComponent);
                    contentDiv.innerHTML = '<h1>Error: Unable to load view.</h1><p>Please check the console for details.</p>';
                }
            } catch (error) {
                console.error(`Router.js: Failed to load or render view for path '${path}':`, error);
                contentDiv.innerHTML = `<h1>Error Loading Page</h1><p>Could not load content for ${path}. Please try again.</p><p>${error.message}</p>`;
            }
        } else {
            console.log("Router.js: No route matched for path:", path);
            // Default 404 page
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
        }
    }
}
Cách sử dụng trong src/main.js:
Bạn cần truyền routesmảng khi khởi tạo Router.

JavaScript

// src/main.js
import './main.scss';
//import { appEvents } from './utils/EventEmitter.js'; // Still commented out
import { Header } from './components/Header.js'
import { Sidebar } from "./components/Sidebar.js";
import { routes } from './routes.js'; // Ensure 'routes' is a named export from routes.js
import { Router } from './core/Router.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
        console.warn('no id=app');
        return;
    }

    // header
    const headerInstance = new Header();
    const headerElement = headerInstance.render();
    app.appendChild(headerElement);

    // main container for sidebar and content
    const mainElement = document.createElement('div');
    mainElement.classList.add('main');
    app.appendChild(mainElement);

    // sidebar
    const sidebarInstance = new Sidebar();
    const sidebarElement = sidebarInstance.render();
    mainElement.appendChild(sidebarElement);
    sidebarInstance.init(); // Initialize sidebar functionality

    // content area where views will be rendered
    const contentElement = document.createElement('div');
    contentElement.id = 'content';
    mainElement.appendChild(contentElement);

    // Initialize Router with the routes
    const routerInstance = new Router(routes); // <<< Pass the routes here!

    // Register sidebar to listen for route changes from the router
    routerInstance.onRouteChange((path) => {
        console.log("main.js: Router change detected in main.js for path:", path);
        sidebarInstance.updateActiveLink(path); // Assuming sidebar has a method to update active link
    });

    // Trigger the initial route render after all components are set up
    routerInstance.triggerInitialRoute();
});
Những cân nhắc quan trọng cho các thành phần View của bạn ( PostIndex.js, v.v.):
Để tải động này hoạt động, các tệp xem của bạn (như views/posts/PostIndex.js) phải xuất một lớp (hoặc một hàm trả về một phần tử) có render()phương thức.

Ví dụ src/views/posts/PostIndex.js:

JavaScript

// src/views/posts/PostIndex.js
export default class PostIndex {
    constructor() {
        console.log("PostIndex view constructed!");
    }

    render() {
        // Create a div element for the view
        const div = document.createElement('div');
        div.classList.add('post-index-view');
        div.innerHTML = `
            <h1>All Posts</h1>
            <p>Welcome to the Posts Index page! This content is dynamically loaded.</p>
            <ul>
                <li>Post 1: Lorem ipsum dolor sit amet.</li>
                <li>Post 2: Consectetur adipiscing elit.</li>
                <li>Post 3: Sed do eiusmod tempor incididunt.</li>
            </ul>
            <button class="add-post-btn">Add New Post</button>
        `;

        // Example of adding some basic interactivity within the view
        const button = div.querySelector('.add-post-btn');
        if (button) {
            button.addEventListener('click', () => {
                alert('Add New Post functionality would go here!');
            });
        }

        return div;
    }

    // Optional: A method to run after the view is added to the DOM
    init() {
        console.log("PostIndex view initialized after rendering.");
        // You might add event listeners or perform other DOM manipulations here
    }
}
Nếu PostIndexlà một xuất khẩu được đặt tên:

JavaScript

// src/views/posts/PostIndex.js (if it's a named export)
export class PostIndex { // Note 'export' directly before 'class'
    // ... same content as above ...
}
Trong trường hợp này, _loadAndRenderViewin Router.jssẽ dựa vào module[matchedRoute.view]để lấy PostIndexlớp. Mã hiện tại module.default || module[matchedRoute.view]xử lý cả hai trường hợp.

Thiết lập này làm cho ứng dụng của bạn có tính mô-đun hơn và cho phép mở rộng dễ dàng các tuyến đường và chế độ xem mới.