// ./src/routes.js

const routes = {
    '/': '@views/home.js',
    '/posts/{id}': '@views/posts/post-detail.js',
    '/404': '@views/not-found.js'
}

export {routes};