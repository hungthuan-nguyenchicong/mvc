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