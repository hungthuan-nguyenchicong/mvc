// ./src/routes.js

// const routes = {
//     '/admin/views/': '@views/home.js',
//     '/admin/views': '@views/home.js',
//     '/admin/views/posts/{id}': '@views/posts/post-show.js',
//     '/admin/views/404': '@views/not-found.js'
// }

// export {routes};

// const routes = {
//     '/admin/views/?home@index': '@views/home.js',
//     '/admin/views/?posts/{id}': '@views/posts/post-show.js',
//     '/admin/views/?404': '@views/not-found.js'
// }

// export {routes};

// const routes = {
//     '/admin/views': { // Chúng ta sẽ xử lý query string cho đường dẫn này
//         'home': '@views/home.js',        // Ví dụ: /admin/views?view=home
//         'posts': '@views/posts/post-show.js', // Ví dụ: /admin/views?view=posts&id=123
//         '404': '@views/not-found.js'     // Nếu không tìm thấy view cụ thể
//     }
//     // Có thể thêm các đường dẫn khác nếu có, không liên quan đến query string
// };

const routes = {
    '/admin/views/': { // Chúng ta sẽ xử lý query string cho đường dẫn này
        'home': '@views/home.js',       // Ví dụ: /admin/views?view=home
        'posts-index': '@view/post-index.js',
        'posts-show/{id}': '@views/posts/post-show.js', // Ví dụ: /admin/views?view=posts&id=123
        '404': '@views/not-found.js'     // Nếu không tìm thấy view cụ thể
    }
    // Có thể thêm các đường dẫn khác nếu có, không liên quan đến query string
};
export {routes};