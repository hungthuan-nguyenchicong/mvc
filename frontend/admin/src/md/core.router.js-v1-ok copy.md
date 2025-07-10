# core.router.js

You've got a good start on your router! The primary challenge is handling the query string for the /admin/views/ path, as your current MapsTo method only considers window.location.pathname.

Let's refine the Router class to effectively manage routes with query strings.

Here's the improved core.router.js with explanations:

JavaScript

// ./src/core.router.js

import { eventEmitterInstance } from "../utils/event-emitter";

function tt(t) {
    console.log(t)
}

const routes = {
    '/admin/views/': { // This path will be handled with query parameters
        'home': '@views/home.js',
        'posts-index': '@views/post-index.js',
        'posts-show/{id}': '@views/posts/post-show.js',
        '404': '@views/not-found.js'
    },
    // Add other direct routes here if needed, not relying on query strings
    '/': '@views/home.js', // Example: a default route for the root
    '/about': '@views/about.js' // Example: another direct route
};

class Router {
    constructor(routes) {
        this.routes = routes;
        this.eventEmitterInstance = eventEmitterInstance;
        // Initialize currentPath, queryString, and searchParams based on the initial URL
        this.updateCurrentUrlInfo();
    }

    // Helper to update URL related properties
    updateCurrentUrlInfo() {
        this.currentPath = window.location.pathname;
        this.queryString = window.location.search;
        this.searchParams = new URLSearchParams(window.location.search);
    }

    async renderContent(content) {
        const contentElement = document.querySelector('main div.content');
        if (!contentElement) {
            console.error('No <main> <div class="content"> element found.');
            return;
        }
        contentElement.innerHTML = content;
    }

    async navigateTo(path) {
        // Update URL info immediately when navigating
        this.updateCurrentUrlInfo();

        console.log(`Navigating to: ${path}`);
        console.log(`Current path: ${this.currentPath}`);
        console.log(`Query string: ${this.queryString}`);
        console.log(`View parameter: ${this.searchParams.get('view')}`);

        let matchedRouteFile = null;
        let params = {}; // For path parameters like {id}

        // --- Route Matching Logic ---
        // 1. Check for direct path matches first (e.g., '/', '/about')
        if (this.routes[this.currentPath] && typeof this.routes[this.currentPath] === 'string') {
            matchedRouteFile = this.routes[this.currentPath];
        } else if (this.currentPath.startsWith('/admin/views/')) {
            // 2. Handle /admin/views/ specifically for query string routing
            const viewParam = this.searchParams.get('view');
            if (viewParam) {
                const adminViewsRoutes = this.routes['/admin/views/'];
                if (adminViewsRoutes) {
                    // Try to match viewParam with a direct view name
                    if (adminViewsRoutes[viewParam] && typeof adminViewsRoutes[viewParam] === 'string') {
                        matchedRouteFile = adminViewsRoutes[viewParam];
                    } else {
                        // Handle path parameters within /admin/views/ (e.g., posts-show/{id})
                        for (const routeKey in adminViewsRoutes) {
                            if (routeKey.includes('{') && routeKey.includes('}')) {
                                const routeRegex = new RegExp(`^${routeKey.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
                                const potentialMatch = viewParam.match(routeRegex);
                                if (potentialMatch) {
                                    params = potentialMatch.groups || {};
                                    matchedRouteFile = adminViewsRoutes[routeKey];
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // If still no specific view matched for /admin/views/, default to 404
            if (!matchedRouteFile && this.routes['/admin/views/'] && this.routes['/admin/views/']['404']) {
                matchedRouteFile = this.routes['/admin/views/']['404'];
            }
        } else {
            // 3. Fallback for generic 404 if no route matches at all
            // This assumes a top-level 404 for non-admin paths, adjust as needed.
            // For simplicity, let's assume if nothing matches, we direct to a general 404.
            // You might need a more sophisticated top-level 404 handler.
            if (this.routes['/admin/views/'] && this.routes['/admin/views/']['404']) {
                 matchedRouteFile = this.routes['/admin/views/']['404'];
            }
        }
        // --- End Route Matching Logic ---


        if (matchedRouteFile) {
            try {
                // Ensure the import path is correct; it usually relative to the current file.
                // Assuming views are in '../views/'
                const module = await import(/* webpackChunkName: "view-[request]" */ `../views/${matchedRouteFile.replace('@views/', '')}`);
                const viewComponent = module.default;
                const viewInstance = new viewComponent(params); // Pass path parameters
                const content = await viewInstance.render();

                await this.renderContent(content);

                // If the 404 view was loaded, replace the history state to reflect the 404 URL
                if (matchedRouteFile === '@views/not-found.js' && !this.currentPath.includes('/404')) {
                    // Only replace if the current URL isn't already a 404 to avoid infinite pushes/replacements
                    window.history.replaceState(null, null, '/admin/views/404');
                }
            } catch (error) {
                console.error(`Router.js: Could not load or render view for '${matchedRouteFile}':`, error);
                // Optionally, navigate to a generic error page here
                if (this.routes['/admin/views/'] && this.routes['/admin/views/']['404']) {
                    this.navigateTo('/admin/views/?view=404'); // Redirect to 404 on error
                }
            }
        } else {
            // If no matched route file, even after 404 considerations
            console.warn(`Router.js: No route found for path '${path}' with query '${this.queryString}'.`);
            // This case should ideally be caught by the 404 logic.
        }
        this.eventEmitterInstance.emit('routeChange', this.currentPath);
    }

    setupRouterListeners() {
        document.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[route]');
            if (routeLink) {
                e.preventDefault();
                const path = routeLink.getAttribute('href'); // Use routeLink for href
                if (window.location.href !== path) { // Compare full href for query string changes
                    window.history.pushState(null, null, path);
                }
                this.navigateTo(path);
            }
        });

        window.addEventListener('popstate', () => {
            // When popstate fires, the browser's URL is already updated.
            // We just need to navigate to that new URL.
            this.navigateTo(window.location.pathname + window.location.search);
        });
    }

    init() {
        this.setupRouterListeners();
        // Initial load of the page based on the current URL
        this.navigateTo(this.currentPath + this.queryString);
    }
}

export const routerInstance = new Router(routes);
Key Changes and Explanations:
updateCurrentUrlInfo() Method:

I've added a helper method updateCurrentUrlInfo() to consolidate updating currentPath, queryString, and searchParams. This ensures these properties are always fresh when MapsTo is called or when the URL changes (e.g., via popstate).

Route Matching Logic in MapsTo():

Prioritize Direct Path Matches: The router now first checks if this.currentPath directly matches any top-level keys in this.routes (e.g., /, /about). This is crucial for routes that don't rely on query strings.

Handling /admin/views/ with Query Strings:

If the currentPath starts with /admin/views/, it then specifically looks for the view parameter in this.searchParams.

It then attempts to match the viewParam against the sub-routes defined under routes['/admin/views/'].

Path Parameters within Query String Views: The logic now correctly handles dynamic segments like posts-show/{id} when view=posts-show/123 by using a regular expression against the viewParam itself. The params object will correctly capture the id.

Specific /admin/views/ 404: If no specific view is found within /admin/views/, it defaults to @views/not-found.js (assuming 404 is a key within the /admin/views/ object).

Generic Fallback 404: A basic fallback for a generic 404 is included if no route matches at all. You might want to define a separate '/404' route at the top level for a more general 404 page.

MapsTo(path) Argument:

The MapsTo method now expects the full path including the query string when called externally (e.g., from setupRouterListeners or init). This allows it to correctly parse the view parameter.

window.history.pushState and window.location.href Comparison:

In setupRouterListeners, when a link is clicked, the href attribute of the <a> tag now captures the full path including the query string.

We compare window.location.href (which includes the query string) with the new path to decide if pushState is needed. This prevents unnecessary history entries when only the hash changes, or when the full URL is already the same.

popstate Event Listener:

When the browser's back/forward buttons are used, popstate fires. The window.location object is already updated to the new URL by the browser. Therefore, inside the popstate listener, we simply call this.navigateTo(window.location.pathname + window.location.search) to process the new full URL.

init() Method:

The init() method now calls MapsTo with the currentPath and queryString from the initial page load to ensure the correct content is rendered from the start.

To Make This Work, You'll Need:
../views/home.js (example):

JavaScript

// ../views/home.js
class HomePage {
    constructor(params) {
        this.params = params; // If you need to use params on the home page
    }
    async render() {
        return `<h1>Welcome Home!</h1><p>This is the home page.</p>`;
    }
}
export default HomePage;
../views/post-index.js (example):

JavaScript

// ../views/post-index.js
class PostIndexPage {
    async render() {
        return `<h1>All Posts</h1><p>Here's a list of posts.</p>`;
    }
}
export default PostIndexPage;
../views/posts/post-show.js (example):

JavaScript

// ../views/posts/post-show.js
class PostShowPage {
    constructor(params) {
        this.params = params; // Will contain { id: '...' }
    }
    async render() {
        const postId = this.params.id || 'N/A';
        return `<h1>Post Details for ID: ${postId}</h1><p>This is the detail page for a post.</p>`;
    }
}
export default PostShowPage;
../views/not-found.js (example):

JavaScript

// ../views/not-found.js
class NotFoundPage {
    async render() {
        return `<h1>404 - Page Not Found</h1><p>The page you requested could not be found.</p>`;
    }
}
export default NotFoundPage;
../utils/event-emitter.js (example, if you don't have it):

JavaScript

// ../utils/event-emitter.js
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(data));
        }
    }

    off(eventName, listenerToRemove) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(listener => listener !== listenerToRemove);
    }
}

export const eventEmitterInstance = new EventEmitter();
This enhanced router will now correctly interpret URLs with query strings, especially for your /admin/views/ structure, and pass any extracted parameters to your view components.

## ver 2

// ./src/core.router.js

const routes = {
    // These are your path-based routes
    'admin/home': '@views/home.js', // Adjusted to be a full path for clarity
    'admin/post-index': '@views/post-index.js',
    'admin/post-show/{id}': '@views/post-show.js',
    'admin/404': '@views/not-found.js' // It's @views, not @view
};

class Router {
    constructor(routes) {
        this.routes = routes;
        // Initial path, will be updated by navigateTo
        this.currentPath = window.location.pathname;

        // Initialize searchParams correctly for the current URL
        this.searchParams = new URLSearchParams(window.location.search);

        console.log('1. Initial window.location.search:', window.location.search);
        console.log('2. Initial searchParams object:', this.searchParams.toString());
    }

    async renderContent(content) {
        const contentElement = document.querySelector('.content');
        if (!contentElement) {
            console.error('No main>div.content');
            return;
        }
        contentElement.innerHTML = content;
    }

    // navigateTo now only takes the desired path (like /admin/views or /admin/views/post-show/123)
    // Query string changes should happen via pushState/replaceState or by external links
    async navigateTo(path) {
        // Update the URL in the browser's history
        // Use pushState to allow back/forward buttons
        // Note: The second arg (state object) is typically empty for simple SPAs
        // The third arg (title) can be updated if you have page titles
        window.history.pushState({}, '', path);

        // Update the router's internal state
        this.currentPath = path;
        this.searchParams = new URLSearchParams(window.location.search); // Re-parse query string for new URL

        console.log(`Navigating to: ${path}`);
        console.log(`Current path (updated): ${this.currentPath}`);
        console.log(`Query string (updated): ${this.searchParams.toString()}`);

        let matchedRouteFile = null;
        let params = {}; // For path parameters like {id}

        // --- Logic for handling PATH-BASED routes ---
        for (const routePath in this.routes) {
            // Escape special characters in routePath and replace {param} with named capture group
            const regexPath = routePath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\{([a-zA-Z0-9-]+)\\}/g, '(?<$1>[a-zA-Z0-9-]+)');
            const routeRegex = new RegExp(`^/${regexPath}$`); // Ensure leading slash if paths are like 'admin/home'

            const potentialMatch = this.currentPath.match(routeRegex);

            if (potentialMatch) {
                params = potentialMatch.groups || {};
                matchedRouteFile = this.routes[routePath];
                break;
            }
        }

        // --- Logic for handling QUERY-BASED views as a fallback or primary view ---
        const viewParam = this.searchParams.get('view');
        if (viewParam) {
            // Assuming your 'home', 'post-index' etc. from previous examples
            // are actually values for the 'view' query parameter
            const viewMapping = {
                'home': '@views/home.js',
                'post-index': '@views/post-index.js'
                // Add other query-based views here if needed
            };
            if (viewMapping[viewParam]) {
                matchedRouteFile = viewMapping[viewParam];
                // You might also set this.currentPath or a specific viewName variable here
            }
        }

        // --- Determine final file to load ---
        if (matchedRouteFile) {
            console.log(`Matched route file: ${matchedRouteFile}`);
            // Dynamically import the module and render its content
            try {
                // Adjust import path as needed, assuming '@views/' needs to be resolved
                // This is a placeholder and depends on your build setup (e.g., Webpack aliases)
                const modulePath = matchedRouteFile.replace('@views/', './views/').replace('@view/', './views/'); // Assuming @view was a typo
                const { default: viewModule } = await import(modulePath);
                // Assuming viewModule has a render method or directly provides content
                if (typeof viewModule.render === 'function') {
                    await this.renderContent(await viewModule.render(params)); // Pass params if the view uses them
                } else if (typeof viewModule === 'string') {
                    await this.renderContent(viewModule);
                } else {
                    console.error('View module does not have a render method or is not a string:', viewModule);
                }
            } catch (error) {
                console.error(`Error loading view module ${matchedRouteFile}:`, error);
                // Fallback to 404 if loading fails
                matchedRouteFile = this.routes['admin/404'];
                // Re-attempt loading 404 page
                 try {
                    const modulePath = matchedRouteFile.replace('@views/', './views/').replace('@view/', './views/');
                    const { default: viewModule } = await import(modulePath);
                    if (typeof viewModule.render === 'function') {
                        await this.renderContent(await viewModule.render(params));
                    } else if (typeof viewModule === 'string') {
                        await this.renderContent(viewModule);
                    }
                 } catch (e404) {
                     console.error('Failed to load 404 page:', e404);
                 }
            }
        } else {
            console.warn(`No route or view matched for path: ${this.currentPath} and query: ${this.searchParams.toString()}`);
            // Fallback to 404
            matchedRouteFile = this.routes['admin/404'];
            try {
                const modulePath = matchedRouteFile.replace('@views/', './views/').replace('@view/', './views/');
                const { default: viewModule } = await import(modulePath);
                if (typeof viewModule.render === 'function') {
                    await this.renderContent(await viewModule.render(params));
                } else if (typeof viewModule === 'string') {
                    await this.renderContent(viewModule);
                }
            } catch (e404) {
                console.error('Failed to load 404 page:', e404);
            }
        }
    }

    init() {
        // Handle initial load
        this.navigateTo(this.currentPath);

        // Add event listener for browser's back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        // Intercept link clicks to prevent full page reloads
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault(); // Stop default link behavior
                this.navigateTo(e.target.href);
            }
        });
    }
}

// Corrected routes mapping (use full paths for path-based routing)
// The 'home', 'post-index' etc. for `?view=` should be handled separately
// or integrated into your path-based routes if they are distinct URLs.
// For example, if /admin/ is 'home' and /admin/posts/ is 'post-index'.
const appRoutes = {
    '/admin/': '@views/home.js', // Matches /admin/
    '/admin/posts': '@views/post-index.js', // Matches /admin/posts
    '/admin/posts/{id}': '@views/post-show.js', // Matches /admin/posts/123
    '/admin/404': '@views/not-found.js' // Or just '/404' if it's top-level
};

// If your 'home', 'post-index' are indeed values of 'view' parameter,
// you need a separate lookup for them, as shown in navigateTo.

export const routerInstance = new Router(appRoutes);