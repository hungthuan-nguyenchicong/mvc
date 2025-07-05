## v1

// src/core/Router.js
import { appEvents } from "../utils/EventEmitter.js";

export class Router {
    constructor(routes) {
        this.appEvents = appEvents;
        this.routes = routes;
        this.currentPath = window.location.pathname; // Initialize currentPath
        // No explicit 'init()' call here; it will be called from main.js
    }

    // This method will handle both route matching and dynamic rendering
    async navigateTo(path) {
        this.currentPath = path;
        console.log("Router.js: Navigating to path:", path);

        // Find the route that matches the current path, including parameters
        let matchedRoute = null;
        let routeParams = {}; // Use an object for named parameters if your route.path uses {paramName}

        for (const route of this.routes) {
            // Convert route path to a regex to match and capture parameters
            // Example: /posts/{id} -> /posts/([a-zA-Z0-9_]+)
            const routePathRegex = new RegExp(`^${route.path.replace(/\{([a-zA-Z0-9_]+)\}/g, '([a-zA-Z0-9_]+)')}$`);
            const match = path.match(routePathRegex);

            if (match) {
                matchedRoute = route;
                // Extract parameter values and potentially map them to names from the route path
                const paramValues = match.slice(1);
                const paramNames = (route.path.match(/\{([a-zA-Z0-9_]+)\}/g) || []).map(name => name.substring(1, name.length - 1));

                routeParams = paramValues.reduce((acc, val, index) => {
                    if (paramNames[index]) {
                        acc[paramNames[index]] = val;
                    } else {
                        // For unmatched or unnamed regex groups, add as indexed if needed
                        acc[`param${index}`] = val;
                    }
                    return acc;
                }, {});
                break;
            }
        }

        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error("Router.js: No element with id 'content' found to render content.");
            return;
        }

        contentDiv.innerHTML = ''; // Clear previous content
        contentDiv.textContent = 'Loading...'; // Show loading indicator

        if (matchedRoute) {
            try {
                // Dynamically import the module specified by 'file' in your route
                // Example: import('./views/posts/PostIndex.js')
                const module = await import(matchedRoute.file);

                // Assuming your view components are exported as default classes (e.g., export default class PostIndex { ... })
                const ViewComponent = module.default;

                if (typeof ViewComponent === 'function' && ViewComponent.prototype && ViewComponent.prototype.constructor === ViewComponent) {
                    // Instantiate the component, passing parameters to its constructor if it accepts them
                    const instance = new ViewComponent(routeParams); // Pass extracted parameters here

                    // Check for a 'render' or 'getHtml' method and call it
                    let viewContent;
                    if (typeof instance.render === 'function') {
                        viewContent = instance.render();
                    } else if (typeof instance.getHtml === 'function') { // Support your original getHtml if preferred
                        viewContent = await instance.getHtml(routeParams); // Pass params to getHtml
                    } else {
                        console.error(`Router.js: View component for '${path}' does not have a 'render()' or 'getHtml()' method.`);
                        contentDiv.innerHTML = '<h1>Error: View component malformed.</h1><p>Missing render() or getHtml() method.</p>';
                        return;
                    }

                    contentDiv.innerHTML = ''; // Clear loading indicator
                    // Append the content. If render/getHtml returns a string, use innerHTML; else, append as node.
                    if (typeof viewContent === 'string') {
                        contentDiv.innerHTML = viewContent;
                    } else if (viewContent instanceof Element || viewContent instanceof DocumentFragment) {
                        contentDiv.appendChild(viewContent);
                    } else {
                        console.error(`Router.js: View component '${matchedRoute.view}' for path '${path}' returned an invalid type for content.`, viewContent);
                        contentDiv.innerHTML = '<h1>Error: Invalid View Content.</h1>';
                    }

                    // Attach events after the HTML has been rendered into the DOM
                    if (typeof instance.attachEvents === 'function') { // Support your original attachEvents
                        instance.attachEvents();
                    } else if (typeof instance.init === 'function') { // Support your original init
                        instance.init();
                    }

                } else {
                    console.error(`Router.js: Imported view '${matchedRoute.view}' for path '${path}' is not a valid component class (received:`, ViewComponent, `).`);
                    contentDiv.innerHTML = '<h1>Error: Unable to load view.</h1><p>Please check the console for details.</p>';
                }
            } catch (error) {
                console.error(`Router.js: Failed to load or render view for path '${path}':`, error);
                contentDiv.innerHTML = `<h1>Error Loading Page</h1><p>Could not load content for ${path}. Please try again.</p><p>${error.message}</p>`;
            }
        } else {
            console.log("Router.js: No route matched for path:", path);
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
        }
        // Emit path change event after content is rendered
        this.appEvents.emit('pathChanged', this.currentPath);
    }

    // Initial setup for listeners (popstate and click events)
    init() {
        // Handle browser history changes (back/forward buttons)
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        // Handle clicks on internal navigation links (those with data-link attribute)
        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[data-link]');
            if (routeLink) {
                e.preventDefault(); // Prevent default link behavior
                const path = routeLink.getAttribute('href');

                // If navigating to the same path, just re-render (optional, depends on desired behavior)
                if (window.location.pathname === path) {
                    console.log("Router.js: Clicking on current path, re-rendering.");
                    this.navigateTo(path);
                    return;
                }

                history.pushState(null, '', path); // Update browser history
                this.navigateTo(path); // Navigate and render the new path
            }
        });

        // Perform initial routing when the page first loads
        this.navigateTo(this.currentPath);
    }
}


###

// ./src/inc/router.js

export const routes = {
    '/': {
        path: './templates/home/home.js',
        view: 'Home'
    },
    '/about': {
        path: './templates/about/about.js',
        view: 'About'
    },
    '/contact': {
        path: './templates/contact/contact.js',
        view: 'Contact'
    }
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname; // Initialize with current URL path
        this.init(); // Call init method to set up event listeners
    }

    /**
     * Initializes the router by handling the initial route and setting up event listeners.
     */
    init() {
        // Handle initial route when the page loads
        this.handleRoute(this.currentPath);

        // Listen for browser's back/forward button events
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            this.handleRoute(this.currentPath);
        });

        // Listen for clicks on internal links
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault(); // Prevent default link behavior
                this.navigate(e.target.href);
            }
        });
    }

    /**
     * Navigates to a new URL and updates the browser history.
     * @param {string} url The URL to navigate to.
     */
    navigate(url) {
        // Prevent navigation if the URL is the same
        if (url === this.currentPath) {
            return;
        }

        history.pushState(null, null, url); // Add new entry to browser history
        this.currentPath = window.location.pathname;
        this.handleRoute(this.currentPath);
    }

    /**
     * Handles the given route path, loads the corresponding view, and updates the DOM.
     * @param {string} path The path to handle.
     */
    async handleRoute(path) {
        const route = this.routes[path] || this.routes['/']; // Fallback to home if route not found

        if (!route) {
            console.error('Route not found:', path);
            // Optionally redirect to a 404 page
            return;
        }

        console.log(`Navigating to: ${route.view} (${path})`);

        try {
            // Dynamically import the view module
            // In a real application, you'd likely render the content into a specific DOM element
            const module = await import(route.path);
            const viewContent = module.render ? module.render() : `<h1>${route.view} Page Content</h1>`; // Assuming a render function or default content

            // Here, you'd typically update a main content area in your HTML
            const app = document.getElementById('app'); // Assuming you have a div with id="app"
            if (app) {
                app.innerHTML = viewContent;
                document.title = route.view; // Update document title
            } else {
                console.warn("Element with id 'app' not found. Cannot render view.");
            }

        } catch (error) {
            console.error(`Error loading view for ${path}:`, error);
            // Handle error, e.g., show an error message
        }
    }
}

export const routerInstance = new Router(routes); // Pass your routes to the router instance!

// Example of what your view files might look like (e.g., ./templates/home/home.js)
// export function render() {
//     return `
//         <div>
//             <h2>Welcome to the Home Page!</h2>
//             <p>This is the main content of your application.</p>
//         </div>
//     `;
// }

// You'd also need some HTML to make this work, for example:
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Router Example</title>
</head>
<body>
    <nav>
        <a href="/" data-link>Home</a>
        <a href="/about" data-link>About</a>
        <a href="/contact" data-link>Contact</a>
    </nav>
    <div id="app">
        // Content will be loaded here by the router
    </div>
    <script type="module" src="./src/inc/router.js"></script>
</body>
</html>
*/

## v2

// ./src/inc/router.js

export const routes = {
    '/': {
        file: './templates/home/home.js',
        class: 'Home'
    },
    // Example of a dynamic route
    '/posts/{id}': { // Use {id} for dynamic segments
        file: './templates/posts/post-detail.js',
        class: 'PostDetail'
    },
    '/about': {
        file: './templates/about/about.js',
        class: 'AboutPage'
    },
    // Add a 404 route for unmatched paths
    '/404': {
        file: './templates/404/not-found.js',
        class: 'NotFound'
    }
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
        this.appContainer = document.querySelector('#app'); // Assuming you have a div with id="app" to render into
        if (!this.appContainer) {
            console.error('Error: Could not find an element with id="app" to render views into.');
        }
    }

    async navigate(path) {
        this.currentPath = path;
        let matchedRoute = null;
        let routeParams = {};

        // Iterate through all defined routes to find a match
        for (const routePath in this.routes) {
            // Regex to match dynamic segments like {id} and capture their values
            // Escapes special regex characters in the routePath, then replaces {param} with capture groups
            const routeRegex = new RegExp(`^${routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/{([a-zA-Z0-9-]+)}/g, '([a-zA-Z0-9-]+)')}$`);
            const potentialMatch = this.currentPath.match(routeRegex);

            if (potentialMatch) {
                matchedRoute = this.routes[routePath];

                // Extract route parameters
                const paramNames = (routePath.match(/{([a-zA-Z0-9-]+)}/g) || []).map(p => p.slice(1, -1));
                paramNames.forEach((name, index) => {
                    routeParams[name] = potentialMatch[index + 1]; // +1 because index 0 is the full match
                });

                break; // Found a match, exit the loop
            }
        }

        if (matchedRoute) {
            try {
                // Dynamically import the module specified by 'file' in your route
                const module = await import(matchedRoute.file);

                // Check if the specified class exists in the imported module
                const ViewClass = module[matchedRoute.class] || module.default; // Try named export first, then default

                if (ViewClass && typeof ViewClass === 'function') {
                    // Instantiate the view class, passing route parameters if any
                    const instance = new ViewClass(routeParams);

                    // Assuming your view class has a render method
                    if (typeof instance.render === 'function') {
                        // Clear existing content and render the new view
                        if (this.appContainer) {
                            this.appContainer.innerHTML = ''; // Clear previous content
                            instance.render(this.appContainer); // Render into the container
                            console.log(`Rendered: ${matchedRoute.class} for path: ${this.currentPath}`);
                        }
                    } else {
                        console.error(`Error: View class '${matchedRoute.class}' does not have a 'render' method.`);
                    }
                } else {
                    console.error(`Error: Class '${matchedRoute.class}' not found in module: ${matchedRoute.file}`);
                }

            } catch (error) {
                console.error(`Failed to load or render view for path '${this.currentPath}':`, error);
                // Optionally navigate to a 404 page if loading fails
                this.navigate('/404');
            }
        } else {
            // No route matched, navigate to 404 page
            console.warn(`No route matched for: ${this.currentPath}. Navigating to /404.`);
            this.navigate('/404');
        }
    }

    setupRouter() {
        this.currentPath = window.location.pathname;
        this.navigate(this.currentPath);
    }

    setupRouterListeners() {
        document.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[route]');
            if (routeLink) {
                e.preventDefault();
                const newPath = routeLink.getAttribute('href');
                if (this.currentPath !== newPath) {
                    window.history.pushState(null, null, newPath);
                    this.navigate(newPath); // Call navigate directly with the new path
                }
            }
        });

        // Listen for browser's back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname); // Navigate to the new path after popstate
        });
    }

    init() {
        this.setupRouterListeners();
        this.navigate(this.currentPath); // Initial route setup when the app loads
    }
}

export const routerInstance = new Router(routes);