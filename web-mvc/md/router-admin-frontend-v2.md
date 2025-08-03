## admin router admin frontend v2

// This file simulates your entire routing structure for demonstration.

// --- FILE: web-mvc/src/admin/template/pages/posts/posts.js
// This module handles all "posts" actions.
function posts() {
    // The main router calls this function, which then returns an object of actions.
    const container = document.querySelector('.content');

    // This function loads the "index" view.
    async function index(params = {}) {
        // Dynamically import the post-index module.
        const module = await import('./posts/post-index.js');
        // Call the exported function from the imported module, passing params.
        const htmlContent = module.adminPostIndex(params);
        // Insert the returned HTML into the container.
        container.innerHTML = htmlContent;
    }

    // This function loads the "create" view.
    async function create(params = {}) {
        // Dynamically import the post-create module.
        const module = await import('./posts/post-create.js');
        const htmlContent = module.adminPostCreate(params);
        container.innerHTML = htmlContent;
    }
    
    // This function loads the "show" view.
    async function show(params = {}) {
        // Dynamically import the post-show module.
        const module = await import('./posts/post-show.js');
        const htmlContent = module.adminPostShow(params);
        container.innerHTML = htmlContent;
    }

    return {
        index,
        create,
        show,
    };
}
// Export the main posts function for the router to use.
export { posts };

// --- FILE: web-mvc/src/admin/template/pages/posts/post-index.js
// This module simply returns the HTML for the index page.
function adminPostIndex(params = {}) {
    const { page = 1, limit = 5 } = params;
    return `
        <h1>Posts Index</h1>
        <p>This is the posts index page.</p>
        <p>Current page: ${page}, items per page: ${limit}</p>
    `;
}
export { adminPostIndex };

// --- FILE: web-mvc/src/admin/template/pages/posts/post-create.js
// This module returns the HTML for the create form.
function adminPostCreate() {
    return `
        <h1>Create New Post</h1>
        <form>
            <label>Title:</label>
            <input type="text" />
            <button type="submit">Save</button>
        </form>
    `;
}
export { adminPostCreate };


// --- FILE: web-mvc/src/admin/template/pages/posts/post-show.js
// This module returns the HTML for a single post.
function adminPostShow(params = {}) {
    const { id = 'N/A' } = params;
    return `
        <h1>Post Details: ${id}</h1>
        <p>This is the content for post with ID: ${id}.</p>
    `;
}
// Correct export statement for the function name.
export { adminPostShow };

// --- FILE: web-mvc/src/admin/core/adminRouterFrontend.js
// This is your main router.
async function adminRouterFrontend() {
    // A simplified router to handle a single route.
    const search = window.location.search;
    const params = new URLSearchParams(search);
    
    const pageName = params.get('p');
    const pageAction = params.get('action');

    // Create a new object for all other parameters.
    const remainingParams = {};
    for (const [key, value] of params.entries()) {
        if (key !== 'p' && key !== 'action') {
            remainingParams[key] = value;
        }
    }

    // A simple mapping of page names to their corresponding module functions.
    // In a real app, you might use dynamic imports here.
    const routes = {
        'posts': posts,
    };

    const routeHandler = routes[pageName];

    if (routeHandler) {
        const moduleInstance = routeHandler();
        const action = pageAction || 'index';

        if (moduleInstance[action]) {
            console.log(`Đang chạy chức năng: ${action} của ${pageName} với các tham số:`, remainingParams);
            await moduleInstance[action](remainingParams);
        } else {
            console.log(`Không tìm thấy hành động "${action}" trong module "${pageName}"`);
        }
    } else {
        console.error("Không tìm thấy route hợp lệ.");
    }
}

// Start the router.
adminRouterFrontend();


