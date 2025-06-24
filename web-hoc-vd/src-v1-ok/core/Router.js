// src/core/Router.js

function renderContent(path) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error("Router.js: No element with id 'content' found to render content.");
        return;
    }
    console.log("Router.js: Rendering content for path:", path);
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

export class Router {
    constructor() {
        this.routeChangeListeners = [];
        console.log("Router.js: Router constructor called. Calling _setupListeners()."); // Changed log
        this._setupListeners(); // Renamed init() to _setupListeners() and made it private-ish
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
        renderContent(initialPath);
        this.#triggerRouteChange(initialPath); // Now this will find registered listeners!
        console.log("Router.js: Initial route change triggered and listeners notified.");
    }

    // Private method to set up event listeners (popstate, click)
    _setupListeners() { // Renamed from init()
        console.log("Router.js: _setupListeners() method called.");

        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            console.log("Router.js: popstate event detected. Path:", currentPath);
            renderContent(currentPath);
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
                    this.#triggerRouteChange(path);
                    return;
                }

                history.pushState(null, '', path);
                console.log("Router.js: Pushed new state to history. New path:", path);
                renderContent(path);
                this.#triggerRouteChange(path);
            }
        });
        console.log("Router.js: data-link click listener attached.");
    }
}