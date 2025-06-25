// src/core/Router.js
import { appEvents } from "../utils/EventEmitter.js";
function renderContent(path) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error("Router.js: No element with id 'content' found to render content.");
        return;
    }
    //console.log("Router.js: Rendering content for path:", path);
    switch (path) {
        case '/':
            contentDiv.innerHTML = '<h1>Welcome to the Dashboard!</h1><p>This is your main dashboard view.</p>';
            break;
        case '/posts':
            contentDiv.innerHTML = '<h1>All Posts</h1><p>Here you can view and manage all your blog posts.</p>';
            break;
        case '/post/create':
            contentDiv.innerHTML = '<h1>Create New Post</h1><p>Use this form to write and publish a new post.</p>';
            break;
        case '/category/post':
            contentDiv.innerHTML = '<h1>Post Categories</h1><p>Organize your posts into categories.</p>';
            break;
        case '/product':
            contentDiv.innerHTML = '<h1>All Products</h1><p>Browse and manage your product catalog.</p>';
            break;
        case '/product/create':
            contentDiv.innerHTML = '<h1>Create New Product</h1><p>Add a new product to your inventory.</p>';
            break;
        case '/category/product':
            contentDiv.innerHTML = '<h1>Product Categories</h1><p>Define categories for your products.</p>';
            break;
        case '/settings':
            contentDiv.innerHTML = '<h1>Settings</h1><p>Adjust application settings and preferences.</p>';
            break;
        case '/logout':
            contentDiv.innerHTML = '<h1>Logging Out...</h1><p>You have been successfully logged out.</p>';
            break;
        default:
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
            break;
    }
}
// function tt(t) {
//     console.log(t);
// }
export class Router {
    constructor() {
        this.appEvents = appEvents;
        this.routes = [];
        this.currentPath = window.location.pathname;
    }

    #currentPathname (path) {
        this.currentPath = path;
        // emit an event whenerver the path change internaly
        this.appEvents.emit('pathChanged', this.currentPath);
        return this.currentPath;
    }

    init() {
        //this.appEvents = appEvents;
        // Use 'popstate' instead of 'posttate' for history changes
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            // emit an event whenerver the path change internaly
            this.appEvents.emit('pathChanged', this.currentPath);
            //tt(`Path changed via popstate to: ${this.currentPath}`);
            renderContent(this.currentPath); // Re-render content when history changes (e.g., back/forward button)
        });
        document.body.addEventListener('click', (e)=>{
            const routeLink = e.target.closest('a[data-link]');
            if (routeLink) {
                e.preventDefault();
                const path = routeLink.getAttribute('href');
                this.#currentPathname(path);

                history.pushState(null, '', path);
                renderContent(path);
                //tt(path);
            }
        });
        // emit an event whenerver the path change internaly
        this.appEvents.emit('pathChanged', this.currentPath);
        // Initial render based on the current path when the page loads
        renderContent(this.currentPath);
        //tt(`Path default to: ${this.currentPath}`);
    }
}