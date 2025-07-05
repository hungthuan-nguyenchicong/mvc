// src/routes.js

const routes = {
    '/': {
        file: '@views/home.js',
        view: 'Home Page'
    },
    '/about': {
        file: '@views/about.js',
        view: 'About Us'
    },
    // Dynamic route for post details
    '/posts/{id}': {
        file: '@views/posts/post-detail.js',
        view: 'Post Detail' // You might want to make this dynamic in the view itself
    },
    // 404 Not Found page
    '/404': {
        file: '@views/not-found.js',
        view: 'Page Not Found'
    }
};

export { routes };