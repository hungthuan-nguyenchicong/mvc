// web-mvc/src/admin/routes.js
import { dashboard } from "./template/pages/dashboard";
import { posts } from "./template/pages/posts";
import { notFound } from "./template/pages/notFound";
// test wysiwyg
import { testWysiwyg } from "./template/pages/testWysiwyg";
// test quill.js
import { testquillWysiwyg } from "./template/pages/testquillWysiwyg";
const routes = {
    'dashboard': dashboard,
    'posts': posts,
    'notFound': notFound,
    'testWysiwyg': testWysiwyg,
    'testquillWysiwyg': testquillWysiwyg,
}

export {routes}