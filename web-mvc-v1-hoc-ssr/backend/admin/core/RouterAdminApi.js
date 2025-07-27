// web-mvc/backend/admin/core/RouterAdminApi.js

export class RouterAdminApi {
    constructor(req) {
        this.req = req;
    }

    async handle() {
        const url = new URL(this.req.url);
        const searchString = url.search;

        const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);

        if (!match) {
            return Response.json({error: 'Đinh dạng query string không phù hợp'},{status:400});
        }
        const [,controllerName, action, paramString] = match;
        // --- BẮT ĐẦU PHÂN TÍCH paramString ---
        // Chuyển searchParams thành object để truyền vào controller
        const params = {}
        if (paramString) {
            // Tạo một URLSearchParams mới từ chuỗi remainingParamsString
            // Cách này an toàn và xử lý URL decoding tự động
            const searchParams = new URLSearchParams(paramString || '');
            // Duyệt qua các tham số và lưu vào đối tượng 'params'
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
        }
        // Kiểm tra file controller tồn tại
        const controllerFile = Bun.file(`./backend/admin/controllers/${controllerName}.js`);
        if (!(await controllerFile.exists())) {
            return Response.json({error: `không tìm thấy ${controllerFile}`}, {status:404});
        }
        // Tải controller động
        
        try {
            const controllerModule = await import(`../controllers/${controllerName}.js`);
            const Controller = controllerModule[controllerName] || controllerModule.default;

            if (!Controller) {
                return Response.json(
                    { error: `Không tìm thấy controller ${controllerName}` },
                    { status: 404 }
                );
            }
            // Khởi tạo controller với req
            const controllerInstance = new Controller(this.req);
            // Kiểm tra hành động
            if (!controllerInstance[action]) {
                return Response.json(
                    { error: `Không tìm thấy hành động ${action} trong ${controllerName}` },
                    { status: 404 }
                );
            }
            // Thực thi hành động với tất cả tham số
            return await controllerInstance[action](params);
        } catch (error) {
            console.error(error);
            return Response.json(
                { error: `Lỗi khi tải controller ${controllerName}: ${error.message}` },
                { status: 500 }
            );
        }

        // console.log(controllerFile)
        // return new Response(`echo: ${params}`)
    }
}