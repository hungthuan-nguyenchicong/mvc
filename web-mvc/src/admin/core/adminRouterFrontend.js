// web-mvc/src/admin/core/adminRouterFrontend.js
import { routes } from "../routes";
function adminRouterFrontend() {
    // pathname
    const pathname = window.location.pathname;
    const notFound = routes['notFound'];

    if (pathname === '/admin/') {
        const dashboard = routes['dashboard'];
        dashboard().index();
    } else if (pathname === '/admin/logout') {
        window.location = '/admin/logout';
    } else {
        //const notFound = routes['notFound'];
        notFound().index(`Lỗi: Đường dẫn không hợp lệ "${window.location.pathname}".`);
        return;
    }
    // search
    const search = window.location.search;
    if (search) {
        //console.log(search);
        const searchString = new URLSearchParams(search);
        // xu ly searchString
        const pageName = searchString.get('p');
        const pageAction = searchString.get('action');
        // xu ly param con lai
        const params = {};
        for (const [key, value] of searchString) {
            if (key !== 'p' && key !== 'action') {
                params[key] = value;
            }
        }

        // xu ly route
        const routeHandler = routes[pageName];
        if (routeHandler) {
            const moduleInstance = routeHandler();
            const action = pageAction;
            if (typeof moduleInstance[action] === 'function') {
                moduleInstance[action](params);
            } else {
                notFound().index(`Không tìm thấy hành động "${action}" trong module "${pageName}"`);
                return;
            }
        } else {
            //const notFound = routes['notFound'];
            notFound().index(`Lỗi: Không tìm thấy route hợp lệ cho trang: "${pageName}"`);
            return;
        }
    }
}

document.addEventListener('navigated', ()=>{
    adminRouterFrontend();
});

export {adminRouterFrontend}