// web-mvc/src/admin/core/adminRouterFrontend.js
import { dashboard } from "../template/pages/dashboard";
import { posts } from "../template/pages/posts";
import { notFound } from "../template/pages/notFound";
// const routes = [
//     '/admin/?PostController@index'
// ]
// import postsModule from '../template/pages/posts.js';
// console.log(postsModule);
// /admin/?p=posts&action=index&page=1&limit=5
const routes = {
    'dashboard':dashboard,
    'posts': posts,
    'notFound': notFound,
}
async function adminRouterFrontend() {
    //const url = new URL();
    //console.log(url)
    const search = window.location.search;
    const searchString = new URLSearchParams(search);
    //console.log(params)
    // các lỗi trả về 404 -> notFound
    let errorMessage = null;
    // xử lý logout
    if (window.location.pathname === '/admin/logout') {
        window.location.href = '/admin/logout';

        // 1. Kiểm tra pathname trước tiên và chặn ngay lập tức nếu không hợp lệ
    } else if (window.location.pathname !== '/admin/') {
        const errorMessage = `Lỗi: Đường dẫn không hợp lệ "${window.location.pathname}".`;
        console.error(errorMessage);
        notFound().index(errorMessage);
        return; // Quan trọng: dừng hàm tại đây
    }
    //const pageName = searchString.get('p');
    const pageName = searchString.get('p') || 'dashboard';
    // lấy p và action ra
    //const pageName = searchString.get('p') || 'dashboard';
    const pageAction = searchString.get('action');
    // tạo đối tượng để lưu params
    const params = {}
    if (searchString) {
        for (const [key, value] of searchString) {
            if (key !== 'p' && key !== 'action') {
                params[key] = value;
            }
        }
    }
    //console.log(params)
    //const pageName = params.p;
    //const pageAction = params.action;
    //console.log(pageAction)
    
    // xây dựng route
    // try {
    //     // Tạo đường dẫn động chính xác
    //     //const pageFile = `../template/pages/${pageName}.js`;
        
    //     // Sử dụng await để chờ module được tải về
    //     // Sử dụng /* @vite-ignore */ để tránh warning của Vite
    //     const module = await import(/* @vite-ignore */ pageFile);

    //     // Truy cập động vào module đã import
    //     // Ví dụ: module.posts sẽ trả về hàm posts()
    //     const importedModuleFunction = module[pageName];

    //     if (importedModuleFunction) {
    //         // Gọi hàm đã được import (ví dụ: posts()) để lấy đối tượng
    //         const moduleInstance = importedModuleFunction(); 

    //         // Gọi động phương thức mong muốn (ví dụ: index())
    //         if (moduleInstance[pageAction]) {
    //             console.log(`Đang chạy chức năng: ${pageAction} của ${pageName}`);
    //             moduleInstance[pageAction]();
    //             console.log(moduleInstance[pageAction]())
    //         } else {
    //             console.log(`Không tìm thấy hành động "${pageAction}" trong module "${pageName}"`);
    //         }
    //     } else {
    //         console.log(`Không tìm thấy export "${pageName}" trong file.`);
    //     }
    // } catch (error) {
    //     console.error("Lỗi khi tải hoặc thực thi module động:", error);
    // }
    const routeHandler = routes[pageName];
    if (routeHandler) {
        const moduleInstance = routeHandler();
        const action = pageAction || 'index';
        if (moduleInstance[action]) {
            //console.log(`Đang chạy chức năng: ${action} của ${pageName || 'notFound'}`);
            moduleInstance[action](params);
        } else {
            errorMessage = `Không tìm thấy hành động "${action}" trong module "${pageName}"`
            notFound().index(errorMessage)
            console.error(errorMessage);
        }
    } else {
        errorMessage = `Lỗi: Không tìm thấy route hợp lệ cho trang: "${pageName}"`;
        notFound().index(errorMessage)
        console.error(errorMessage);
    }
}

// function linkHandler() {
//     const links = document.querySelectorAll('a');
//     links.forEach(link => {
//         link.addEventListener('click',(e) => {
//             e.preventDefault();
//         })
//     })
// }
function linkHandler() {
    document.addEventListener('click', (e) => {
        // Check if the clicked element or its parent is an <a> tag
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            history.pushState(null, null, href);
            // Dispatch a custom event after a successful navigation
            // Pass the new href as part of the event's detail
            const navEvent = new CustomEvent('navigated', {detail: {href:href}});
            document.dispatchEvent(navEvent);

            // Now you can call your routing function to handle the new URL
            adminRouterFrontend();

        }
    })
    // khích hoạt chức năng tiến lên và lùi lại của trình duyệt (nút Back/Forward)
    // Sự kiện này được gọi là popstate -> history.back() hay history.forward()

    window.addEventListener('popstate', (e) => {
        // Dispatch the same custom event for back/forward navigation
        const href = window.location.href;
        const navEvent = new CustomEvent('navigated', {detail: {href: href}});
        document.dispatchEvent(navEvent);
        adminRouterFrontend();
    })
}
linkHandler();
export {adminRouterFrontend}