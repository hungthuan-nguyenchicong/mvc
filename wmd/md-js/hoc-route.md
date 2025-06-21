## h2
// js/router.js
import { tt } from './functions.js';
import { HomePage } from './views/home.js';
import { AboutPage } from './views/about.js';
import { NotFoundPage } from './views/notFound.js'; // Assuming you create this
import { ProductPage } from './views/product.js'; // Example for dynamic routes

export class Router {
    constructor(appElement) {
        if (!appElement) {
            console.error('Router requires an app element to be provided');
            return;
        }
        this.appElement = appElement;
        this.routes = []; // To store our route definitions
        this.handleRouteBound = this.handleRoute.bind(this);

        // Define default and error pages
        this.defaultRoute = '/home'; // Or '/'
        this.notFoundPage = new NotFoundPage(); // Instance of your 404 page
    }

    /**
     * Defines a route with its associated view and an optional name.
     * @param {string} path - The path to match (e.g., 'home', 'about', 'products/:id').
     * @param {class} ViewClass - The class of the view to render for this route.
     * @param {string} [name] - An optional name for the route, useful for programmatic navigation.
     */
    addRoute(path, ViewClass, name = null) {
        // Convert path to a regex for dynamic routes
        const pathRegex = new RegExp(
            '^' + path.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)') + '$'
        );
        this.routes.push({
            path,
            pathRegex,
            ViewClass,
            name,
            paramNames: (path.match(/:([a-zA-Z0-9_]+)/g) || []).map(param =>
                param.substring(1)
            ),
        });
    }

    // Method to start listening for events
    init() {
        window.addEventListener('hashchange', this.handleRouteBound);
        window.addEventListener('DOMContentLoaded', () => {
            this.handleRoute(); // Handle initial load
        });
    }

    /**
     * Programmatically navigates to a new route.
     * @param {string} path - The hash path to navigate to (e.g., '#home', '#products/123').
     * @param {boolean} [replace=false] - If true, replaces the current history entry instead of adding a new one.
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
    }

    /**
     * Resolves the current hash to a route and renders the corresponding view.
     */
    handleRoute() {
        const hash = window.location.hash.substring(1) || this.defaultRoute.substring(1);
        let content = '';
        let matchedRoute = null;
        let routeParams = {};

        // Find a matching route
        for (const route of this.routes) {
            const match = hash.match(route.pathRegex);
            if (match) {
                matchedRoute = route;
                // Extract parameters
                route.paramNames.forEach((name, index) => {
                    routeParams[name] = match[index + 1];
                });
                break;
            }
        }

        if (matchedRoute) {
            try {
                // Pass parameters to the view constructor if it accepts them
                const page = new matchedRoute.ViewClass(routeParams);
                content = page.render();
            } catch (error) {
                console.error(`Error rendering view for route ${hash}:`, error);
                // Fallback to a generic error message or a specific error page
                content = `<h1>Error Loading Page</h1><p>There was an issue loading this page.</p>`;
            }
        } else {
            // No route matched, render 404 page
            content = this.notFoundPage.render();
        }

        this.appElement.innerHTML = content;
        // You could add a post-render hook here, e.g., to run specific scripts for the new content
    }
}

/*
// Example Usage in your main application file (e.g., app.js)

import { Router } from './router.js';
import { HomePage } from './views/home.js';
import { AboutPage } from './views/about.js';
import { ProductPage } from './views/product.js';
import { NotFoundPage } from './views/notFound.js';

const appElement = document.getElementById('app'); // Assuming you have <div id="app"></div> in your HTML
const router = new Router(appElement);

// Define your routes
router.addRoute('home', HomePage, 'home');
router.addRoute('about', AboutPage, 'about');
router.addRoute('products/:id', ProductPage, 'productDetail'); // Example of a dynamic route
router.addRoute('404', NotFoundPage, 'notFound'); // Explicit 404 route, though handled by default

// Set a default route if the hash is empty or unrecognized initially
router.defaultRoute = '/home'; // Or whatever you prefer

// Initialize the router
router.init();

// Example of programmatic navigation
// router.navigate('about');
// router.navigate('products/abc');
*/