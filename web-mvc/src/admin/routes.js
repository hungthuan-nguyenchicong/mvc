// web-mvc/src/admin/routes.js
import { dashboard } from "./template/pages/dashboard";
import { posts } from "./template/pages/posts";
import { notFound } from "./template/pages/notFound";
// test wysiwyg
import { testWysiwyg } from "./template/pages/testWysiwyg";
const routes = {
    'dashboard': dashboard,
    'posts': posts,
    'notFound': notFound,
    'testWysiwyg': testWysiwyg,
}

export {routes}