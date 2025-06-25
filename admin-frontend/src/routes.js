// src/routes.js
// export const routes = [
//     {path: '/api/posts/post-index', file: '/src/views/posts/PostIndex.js', view: 'PostIndex'},
//     // Prepend with /src/ to make it absolute from the web root
// ];

// src/routes.js
export const routes = [
    {path: '/api/posts/post-index', file: '../views/posts/PostIndex.js', view: 'PostIndex'},
    // From src/core/, ../ takes you to src/, then views/posts/
];