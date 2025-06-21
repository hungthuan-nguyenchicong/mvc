// js/main.js

import { Router } from './router.js';
//import { NotFoundPage } from './views/notFound.js'; // NotFoundPage can still be static if always needed

/**
 * Main entry point for the application.
 * Initializes the router and defines the application's routes using dynamic imports.
 */
document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    console.log('main.js: App element found:', !!appElement);

    const router = new Router(appElement);
    console.log('main.js: Router instance created.');

    // Define the application's routes with view paths and class names
    // addRoute(path, viewPath, ViewClassName, name)
    router.addRoute('home', './views/home.js', 'HomePage', 'home');
    console.log('main.js: Added "home" route for dynamic loading.');

    router.addRoute('about', './views/about.js', 'AboutPage', 'about');
    console.log('main.js: Added "about" route for dynamic loading.');

    router.addRoute('404', './views/notfound.js', 'NotFoundPage', '404');

    // Example of a dynamic route (uncomment if you created js/views/product.js)
    router.addRoute('products/:id', './views/product.js', 'ProductPage', 'productDetail');
    console.log('main.js: Added "products/:id" route for dynamic loading.');


    // Set a default route to navigate to if the URL hash is empty or unrecognized on initial load.
    router.defaultRoute = 'home';
    console.log('main.js: Default route set to:', router.defaultRoute);

    // Initialize the router
    router.init();
    console.log('main.js: Router initialized.');

    console.log('main.js: Registered routes (with dynamic paths):', router.routes);

    console.log('Application started. Check network tab to see dynamic loading!');
});
