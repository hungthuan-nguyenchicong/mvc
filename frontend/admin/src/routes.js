// ./src/routes.js

const routes = {
    '/admin/views/': '@views/home.js',
    '/admin/views': '@views/home.js',
    '/admin/views/posts/{id}': '@views/posts/post-show.js',
    '/admin/views/404': '@views/not-found.js'
}

export {routes};