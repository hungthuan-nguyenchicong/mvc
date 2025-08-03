// web-mvc/src/admin/core/adminRouterFrontend.js
import { posts } from "../template/pages/posts";
import { notFound } from "../template/pages/notFound";
// const routes = [
//     '/admin/?PostController@index'
// ]
// import postsModule from '../template/pages/posts.js';
// console.log(postsModule);
// /admin/?p=posts&action=index&page=1&limit=5
const routes = {
    'posts': posts,
    '404': notFound,
}
async function adminRouterFrontend() {
    //const url = new URL();
    //console.log(url)
    const search = window.location.search;
    const searchString = new URLSearchParams(search);
    //console.log(params)
    // lấy p và action ra
    const pageName = searchString.get('p');
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

    const routeHandler = routes[pageName] || routes['404'];
    if (routeHandler) {
        const moduleInstance = routeHandler();

        const action = pageAction || 'index';
        if (moduleInstance[action]) {
            console.log(`Đang chạy chức năng: ${action} của ${pageName || '404'}`);
            moduleInstance[action](params);
        } else {
            console.log(`Không tìm thấy hành động "${action}" trong module "${pageName}"`);
        }
    } else {
        console.error("Không tìm thấy route hợp lệ.");
    }
}

export {adminRouterFrontend}