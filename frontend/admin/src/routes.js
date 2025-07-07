// ./src/routes.js

const routes = {
    '/admin/admin.html': '@views/home.js',
    '/admin/': '@views/home.js',
    '/admin/posts/{id}/': '@views/posts/post-show.js',
    '/admin/404/': '@views/not-found.js'
}

export {routes};