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
            // nếu không truyển request để xử lý req.method
            //const controllerInstance = new module[controllerName];
            //  truyển request để xử lý req.method
            const controllerInstance = new module[controllerName](req);
            // Kiểm tra xem action có tồn tại trong controller không
            if (typeof controllerInstance[action] !== 'function') {
                return Response.json({error: `Action "${action}" không tồn tại trong "${controllerName}"`}, {status:404});
            }
            // Gọi action với các tham số
            return controllerInstance[action](params);
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