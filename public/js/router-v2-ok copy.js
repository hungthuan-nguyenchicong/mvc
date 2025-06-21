// js/router.js
// Removed all static imports for views like HomePage, AboutPage, etc.
// They will be dynamically imported.
import { NotFoundPage } from './views/notFound.js'; // Keep NotFoundPage static if it's always needed

/**
 * @class Router
 * @description Handles client-side hash-based routing for a Single Page Application,
 * supporting dynamic module loading for views.
 */
export class Router {
    /**
     * @param {HTMLElement} appElement - The DOM element where page content will be rendered.
     */
    constructor(appElement) {
        if (!appElement) {
            console.error('Router requires an app element to be provided');
            return; // Exit if critical element is missing
        }
        this.appElement = appElement;
        this.routes = []; // Array to store route definitions { path, pathRegex, viewPath, ViewClassName, name, paramNames }

        // Bind 'this' context for event listeners
        this.handleRouteBound = this.handleRoute.bind(this);

        // Define default and 404 error pages
        this.defaultRoute = 'home';
        this.notFoundPage = new NotFoundPage(); // NotFoundPage can be imported statically if always present
    }

    /**
     * Defines a new route for the application.
     * @param {string} path - The URL hash path (e.g., 'home', 'about', 'products/:id').
     * @param {string} viewPath - The path to the JavaScript file containing the view class (e.g., './views/home.js').
     * @param {string} ViewClassName - The name of the exported class within the viewPath file (e.g., 'HomePage').
     * @param {string} [name=null] - An optional name for the route.
     */
    addRoute(path, viewPath, ViewClassName, name = null) {
        const pathRegex = new RegExp(
            '^' + path.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)') + '$'
        );

        const paramNames = (path.match(/:([a-zA-Z0-9_]+)/g) || []).map(param =>
            param.substring(1)
        );

        this.routes.push({
            path,
            pathRegex,
            viewPath,        // Store the module path
            ViewClassName,   // Store the class name to retrieve from the module
            name,
            paramNames,
        });
        console.log(`Router: Added route "${path}" with dynamic view "${viewPath}" and class "${ViewClassName}".`);
    }

    /**
     * Initializes the router by setting up event listeners.
     */
    init() {
        window.addEventListener('hashchange', this.handleRouteBound);
        window.addEventListener('DOMContentLoaded', () => {
            console.log('Router: DOMContentLoaded fired. Calling handleRoute for initial load.');
            this.handleRoute(); // Handle the route on initial page load
        });
    }

    /**
     * Programmatically navigates to a new route.
     * @param {string} path - The hash path to navigate to.
     * @param {boolean} [replace=false] - If true, replaces the current history entry.
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
        console.log(`Router: Navigating to #${path} (replace: ${replace}).`);
    }

    /**
     * Handles the current URL hash, dynamically loads the view, and renders it.
     * This method is now asynchronous due to the use of 'await import()'.
     */
    async handleRoute() { // IMPORTANT: This method must be async
        const currentHashFromUrl = window.location.hash.substring(1);
        const hash = currentHashFromUrl || this.defaultRoute;
        console.log(`handleRoute: Processing hash: "${currentHashFromUrl || '[empty]'}" -> effective hash for routing: "${hash}"`);

        let content = '';
        let matchedRoute = null;
        let routeParams = {};

        for (const route of this.routes) {
            console.log(`handleRoute: Trying to match "${hash}" against route path "${route.path}" (Regex: ${route.pathRegex})`);
            const match = hash.match(route.pathRegex);
            if (match) {
                matchedRoute = route;
                console.log(`handleRoute: Matched route: "${matchedRoute.path}"`);
                route.paramNames.forEach((name, index) => {
                    routeParams[name] = match[index + 1];
                });
                console.log('handleRoute: Extracted route parameters:', routeParams);
                break;
            }
        }

        if (matchedRoute) {
            try {
                // Display a loading message while the module is being fetched
                // if (this.appElement) {
                //     this.appElement.innerHTML = `
                //         <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                //             <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                //                 <h1 class="text-3xl font-bold text-gray-800 mb-4">Đang tải nội dung...</h1>
                //                 <div class="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                //             </div>
                //         </div>
                //     `;
                // }

                console.log(`handleRoute: Dynamically importing view from "${matchedRoute.viewPath}"`);
                // Dynamically import the module
                const viewModule = await import(matchedRoute.viewPath);

                // Get the specific View Class from the imported module
                const ViewClass = viewModule[matchedRoute.ViewClassName];

                if (ViewClass) {
                    console.log(`handleRoute: Instantiating ViewClass "${matchedRoute.ViewClassName}" for "${matchedRoute.path}"`);
                    const page = new ViewClass(routeParams);
                    content = page.render();
                    console.log(`handleRoute: View for "${matchedRoute.path}" rendered successfully.`);
                } else {
                    console.error(`handleRoute: Class "${matchedRoute.ViewClassName}" not found in module "${matchedRoute.viewPath}".`);
                    content = this.notFoundPage.render(); // Fallback to 404 if class not found in module
                }

            } catch (error) {
                console.error(`handleRoute: Error loading or rendering view for route "${hash}":`, error);
                // content = `
                //     <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                //         <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                //             <h1 class="text-4xl font-bold text-red-600 mb-4">Lỗi tải trang</h1>
                //             <p class="text-gray-600 mb-4">Đã xảy ra sự cố khi tải nội dung trang này.</p>
                //             <a href="#home" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md">
                //                 Về trang chủ
                //             </a>
                //         </div>
                //     </div>
                // `;
            }
        } else {
            console.log(`handleRoute: No route matched for "${hash}". Rendering 404 page.`);
            content = this.notFoundPage.render();
        }

        if (this.appElement) {
            this.appElement.innerHTML = content;
        } else {
            console.error('handleRoute: App element is not defined, cannot render content.');
        }
    }
}
