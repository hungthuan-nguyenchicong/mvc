## import export

# Sử dụng /* @vite-ignore */chú thích
const pageModule = import(/* @vite-ignore */ pageFile);

## page file

// In your code:
const pageFile = `../template/pages/${pageName}.js`;
const pageModule = import(/* @vite-ignore */ pageFile);

## export { posts }(Xuất có tên)

// In another file
import { posts } from './posts.js';
posts().index();

## export default posts(Xuất mặc định)
// In another file
import anyName from './posts.js';
anyName().index();

### export :

// In posts.js
function posts() { ... }
export { posts }; // This is a named export, not a default export.

// In adminRouterFrontend.js
// Use named import syntax { name }
import { posts } from '/src/admin/template/pages/posts.js';

// Now you can call the function like this:
posts().index();

### export default posts;

// In posts.js
function posts() { ... }
// Use default export syntax
export default posts;

## Giải pháp được đề xuất: Sử dụngasync/await

// In adminRouterFrontend.js
async function adminRouterFrontend() {
    // ... all your other code
    const pageName = params.p;
    const pageAction = params.action;

    try {
        const pageFile = `../template/pages/${pageName}/${pageName}.js`;
        
        // Wait for the import to finish
        const module = await import(pageFile);
        
        // The module object contains your named exports
        const { posts } = module; 
        
        // Now you can call the function and its methods
        if (posts) {
            const moduleInstance = posts(); // call the posts function
            if (moduleInstance[pageAction]) {
                moduleInstance[pageAction](); // call the correct method
            } else {
                console.log(`Action not found: ${pageAction}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

## Giải pháp thay thế: Sử dụng.then()

// In adminRouterFrontend.js
function adminRouterFrontend() {
    // ... all your other code
    const pageName = params.p;
    const pageAction = params.action;
    
    const pageFile = `../template/pages/${pageName}/${pageName}.js`;
    
    // Import returns a promise
    import(pageFile)
        .then(module => {
            // The module object contains your named exports
            const { posts } = module;

            // Now you can call the function and its methods
            if (posts) {
                const moduleInstance = posts();
                if (moduleInstance[pageAction]) {
                    moduleInstance[pageAction]();
                } else {
                    console.log(`Action not found: ${pageAction}`);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

## Xử lý Nhập động default

// Use a try-catch block for dynamic import
    try {
        const pageFile = `../template/pages/${pageName}.js`;
        
        // Dynamically import the module, which returns a Promise
        import(pageFile)
            .then(module => {
                // The module object's default export is the 'posts' function
                const pageModule = module.default;
                
                // Call the exported function to get the object with index/create methods
                const actionObject = pageModule();
                
                // Check if the requested action exists on the returned object
                if (typeof actionObject[pageAction] === 'function') {
                    actionObject[pageAction]();
                } else {
                    console.error(`Action '${pageAction}' not found in module '${pageName}'.`);
                }
            })
            .catch(error => {
                console.error(`Error loading page module '${pageFile}':`, error);
            });
            
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    }

## nhạp động page name

try {
        // Tạo đường dẫn động chính xác
        const pageFile = `../template/pages/${pageName}/${pageName}.js`;
        
        // Sử dụng await để chờ module được tải về
        // Sử dụng /* @vite-ignore */ để tránh warning của Vite
        const module = await import(/* @vite-ignore */ pageFile);

        // Truy cập động vào module đã import
        // Ví dụ: module.posts sẽ trả về hàm posts()
        const importedModuleFunction = module[pageName];

        if (importedModuleFunction) {
            // Gọi hàm đã được import (ví dụ: posts()) để lấy đối tượng
            const moduleInstance = importedModuleFunction(); 

            // Gọi động phương thức mong muốn (ví dụ: index())
            if (moduleInstance[pageAction]) {
                console.log(`Đang chạy chức năng: ${pageAction} của ${pageName}`);
                moduleInstance[pageAction]();
            } else {
                console.log(`Không tìm thấy hành động "${pageAction}" trong module "${pageName}"`);
            }
        } else {
            console.log(`Không tìm thấy export "${pageName}" trong file.`);
        }
    } catch (error) {
        console.error("Lỗi khi tải hoặc thực thi module động:", error);
    }

## import trên server
error.message.includes("Cannot find module")

// web-mvc/backend/core/AdminApi.js

class AdminApi {
    constructor() {
        //this.req = req;
    }

    async handle(req) {
        const url = new URL(req.url);
        const searchString = url.search;
        //console.log(searchString);

        const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);
        if (!match) {
            return Response.json({error: 'Đinh dạng query string không phù hợp'}, {status:400});
        }
        //console.log(match)
        const [, controllerName, action, paramString] = match;
        //console.log(paramString);
        //console.log(req)
        const params = {};
        if (paramString) {
            const searchParams = new URLSearchParams(paramString);
            //console.log(searchParams)
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
            //console.log(params)
        }

        const controllerFile = `../admin/controllers/${controllerName}.js`;
        // if (controllerFile) {
        //     const module = await import(controllerFile);
        //     //console.log(module);
        //     const moduleInstance = new module[controllerName];
        //     console.log(moduleInstance);
        //     return moduleInstance[action](params);
        // }
        //return Response.json({ok:'api'});
        try {
            // Thử import file controller
            const module = await import(controllerFile);
            // Kiểm tra xem controller có tồn tại trong module không
            if (!module[controllerName]) {
                return Response.json({error: `Controller "${controllerName}" không tồn tại`}, {status:404});
            }
            const controllerInstance = new module[controllerName];
            // Kiểm tra xem action có tồn tại trong controller không
            if (typeof controllerInstance[action] !== 'function') {
                return Response.json({error: `Action "${action}" không tồn tại trong "${controllerName}"`}, {status:404});
            }
            // Gọi action với các tham số
            controllerInstance[action](params);
        } catch (error) {
            // Bắt lỗi khi import file không thành công
            if (error.message.includes("Cannot find module")) {
                return Response.json({error: `File controller '${controllerName}.js' không tồn tại.`}, {status: 404});
            }
            // Xử lý các lỗi khác
            console.error('Lỗi khi xử lý request:', error);
            return Response.json({error: 'Đã xảy ra lỗi nội bộ.'}, {status: 500});
        }
    }
}

export {AdminApi}

