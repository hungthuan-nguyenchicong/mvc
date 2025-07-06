// ./src/routes.js

const routes = {
    '/': '@views/home.js',
    '/posts/{id}': '@views/posts/post-show.js',
    '/404': '@views/not-found.js'
}

export {routes};