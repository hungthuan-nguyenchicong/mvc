## Sử dụng các tuyến tĩnh cho bộ định tuyến

Based on the code you've provided, you're trying to set up a routing mechanism using a static object (`routes`) instead of a dynamic import. This is a good approach for situations where you want all your code available upfront and don't need code splitting.

Here's how to use your `routes` object to handle static routing, replacing the commented-out dynamic import logic.

First, your `routes` object is set up correctly, but you should only initialize the modules when they are actually called. Initializing them immediately on page load (`posts()`, `notFound()`) can be inefficient. A better practice is to store the function reference and call it later.

-----

### Using Static Routes for a Router

The key is to use your `pageName` variable to access the correct module function directly from the `routes` object. You can then use `pageAction` to call the appropriate method on the returned module instance.

Here is the corrected and simplified code:

```javascript
// web-mvc/src/admin/core/adminRouterFrontend.js
import { posts } from "../template/pages/posts/posts";
import { notFound } from "../template/pages/notFound/notFound";

const routes = {
    'posts': posts, // Store the function reference, don't call it yet
    '404': notFound, // Store the function reference
};

function adminRouterFrontend() {
    const search = window.location.search;
    const params = new URLSearchParams(search);

    const pageName = params.get('p');
    const pageAction = params.get('action');

    // Get the route handler function based on the pageName
    // Use the 404 handler if the pageName is not found
    const routeHandler = routes[pageName] || routes['404'];

    if (routeHandler) {
        // Call the route handler function to get the module instance
        const moduleInstance = routeHandler();
        
        // Get the specific action from the module instance, or default to 'index'
        const action = pageAction || 'index';

        if (moduleInstance[action]) {
            console.log(`Đang chạy chức năng: ${action} của ${pageName || '404'}`);
            moduleInstance[action]();
        } else {
            console.log(`Không tìm thấy hành động "${action}" trong module "${pageName}"`);
        }
    } else {
        console.error("Không tìm thấy route hợp lệ.");
    }
}

// Call the main function to run the router
adminRouterFrontend();
```

### Key Changes Explained

  * **`const routes = { ... }`**: I've changed this to store the function reference (`posts`, not `posts()`). This is a critical change. Calling `posts()` right away would execute the code on every page load, which is inefficient.
  * **Accessing the Handler**: I've used `routes[pageName] || routes['404']` to get the correct function. This is a concise way to check if a route exists and fall back to the 404 page if it doesn't.
  * **Calling the Function**: The line `const moduleInstance = routeHandler();` is where the stored function is actually called. This returns the object containing the `index` and `create` methods.
  * **Default Action**: I've added a fallback to the `'index'` action if `pageAction` is missing from the URL. This is a common and robust practice for a router.

This approach gives you a clean and readable router that uses static imports. It's ideal for smaller applications or administrative dashboards where you want all the code loaded immediately for a snappy user experience.