// ./src/routes.js

// src/routes.js
// const routes = [
//     {
//         path: '/',
//         file: '@views/Home.js', // <-- This is the correct format for your routes
//         view: 'Home Page'
//     },
//     {
//         path: '/about',
//         file: '@views/About.js',
//         view: 'About Us'
//     },
//     {
//         path: '/api/posts/post-index',
//         file: '@views/posts/PostIndex.js',
//         view: 'Post Index'
//     },
//     {
//         path: '/posts/{id}',
//         file: '@views/posts/PostDetail.js',
//         view: 'Post Detail'
//     },
//     // Add other routes similarly, always starting with '@views/'
// ];

// export { routes };

const routes =  {
    '/': {
        file: '@views/home.js',
    },
    '/about': {
        file: '@views/about.js',
    },
    '/404': {
        file: '@views/not-found.js',
    }
}

export { routes };